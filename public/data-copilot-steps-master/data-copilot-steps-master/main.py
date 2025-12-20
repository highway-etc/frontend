import os
import math
import pandas as pd
from pydantic import BaseModel
from sqlalchemy.exc import SQLAlchemyError

from ask_ai.ask_ai_for_echart import get_ask_echart_file_prompt, get_ask_echart_block_prompt
from ask_ai.ask_ai_for_graph import get_ask_graph_prompt
from ask_ai.ask_ai_for_sql import get_sql_code
from ask_ai.ask_python import get_final_prompt, get_py_code
from ask_ai.input_process import get_chart_type
from config.get_config import config_data
from data_access.read_db import execute_select, get_all_table_names, get_rows_from_all_tables
from llm_access import call_llm_test
from llm_access.LLM import get_llm
from llm_access.call_llm_test import call_llm
from utils.exe.code_executor import execute_code
from utils.output_parsing import parse_output

from pywebio.input import input, TEXT, actions, textarea
from pywebio.output import put_html, put_text, put_table, put_markdown, put_image, put_code, put_loading, put_collapse, \
    toast, put_info, put_buttons, use_scope, put_scope, clear

from pywebio import start_server


class AskRequest(BaseModel):
    question: str
    concurrent: int
    retries: int


llm = get_llm()





def download_csv(dataframe, file_type, current_page=None, total_pages=None):
    """支持分页下载的CSV/XLSX生成器，可追加页码到文件名"""
    if file_type == "csv":
        csv_content = dataframe.to_csv(index=False).replace(' ', '%20')
        uri = f"data:text/csv;charset=utf-8,{csv_content}"
    elif file_type == "xlsx":
        with pd.ExcelWriter('temp.xlsx', engine='openpyxl') as writer:
            dataframe.to_excel(writer, index=False)
        with open('temp.xlsx', 'rb') as f:
            xlsx_content = f.read().hex()
        uri = f"data:application/vnd.ms-excel;base64,{xlsx_content}"

    # 生成带页码的文件名
    file_name = f"查询结果.{file_type}"
    if current_page and total_pages:
        file_name = f"查询结果_第{current_page}页_共{total_pages}页.{file_type}"

    download_link = f"""
    <a download="{file_name}" 
       href="{uri}" 
       style="position:fixed;bottom:20px;right:20px;padding:10px;background:#4CAF50;color:white;text-decoration:none">
        点击下载{file_type.upper()}文件
    </a>
    """
    put_html(download_link)
def main():
    put_markdown("# DATA COPILOT")
    # put_info("示例问题：\n"
    #          "统计房价数据最多的10个区的数据数量比例\n"
    #          "统计平均房价最高的三个区域的平均房价变化情况，2000-2020\n"
    #          "列出距离LORONG 7 TOA PAYOH最近的5个车站的名字和距离")

    table_names = get_all_table_names()
    # put_text("数据库：")
    # put_table([table_names])

    first_five_rows = get_rows_from_all_tables()
    # print(first_five_rows)
    with put_collapse(f"数据表："):
        for table_name, rows in first_five_rows.items():
            with put_collapse(f"表 {table_name}"):
                put_text(f"表 {table_name} 的前5行数据:")
                put_table([rows.columns.tolist()] + rows.values.tolist())

    while 1:
        question = textarea("请输入你的问题：", required=True)
        ask_request = AskRequest(question=question, concurrent=1, retries=3)
        put_text("你的问题：" + question)

        # 生成 SQL 代码
        with put_loading():
            sql_code = get_sql_code(ask_request.question, llm)
        # put_text("生成的 SQL 代码：")
        # put_text(sql_code)

        while 1:
            sql_code = textarea("请编辑 SQL 代码并确认执行：", value=sql_code, rows=10, code=True)
            with use_scope('sql_display', clear=True):
                put_text("执行SQL代码：")
                put_code(sql_code, language="sql")
            mid_notes = ""

            # 执行 SQL 查询
            with put_loading():
                full_ans_pd = execute_select(sql_code)
            if isinstance(full_ans_pd, pd.DataFrame):
                with use_scope('data_scope01', clear=True): put_text("查询结果：")
                if not full_ans_pd.empty:
                    current_page = 1
                    per_page = 100
                    max_pages = math.ceil(len(full_ans_pd) / per_page) if not full_ans_pd.empty else 1

                    def show_page(page):
                        nonlocal current_page
                        current_page = page
                        start = (page - 1) * per_page
                        end = start + per_page
                        ans_pd = full_ans_pd.iloc[start:end]
                    # === 在独立作用域中输出内容 ===
                        clear('table_output')  # 清除表格区域
                        clear('download_buttons')# 清除页码信息
                        clear('page_buttons')
                        with use_scope('table_output'):
                        # 显示页码信息
                            clear('page_info')
                            put_text(f"显示第 {page}/{max_pages} 页，共 {len(full_ans_pd)} 条记录", scope='page_info')

                        # 显示表格数据（带滚动条）
                            html = f"""
                            <div style="min-height: 200px; max-height: 400px; overflow-y: auto;">
                                {ans_pd.to_html(index=False)}
                            </div>
                            """
                            put_html(html)

                    # === 分页控制器（保持原位置） ===
                        with use_scope('page_buttons'):
                            put_buttons([
                                {'label': '上一页', 'value': 'prev'},
                                {'label': f'第 {page}/{max_pages} 页', 'value': 'current', 'disabled': True},
                                {'label': '下一页', 'value': 'next'}
                            ], onclick=lambda btn: show_page(
                                max(1, min(max_pages, current_page + (1 if btn == 'next' else -1)))))

                    # === 下载按钮（保持原位置） ===
                        with use_scope('download_buttons'):
                            put_buttons(["下载当前页(csv)", "下载全部页(csv)"], [
                                lambda: download_csv(ans_pd, "csv", current_page, max_pages),
                                lambda: download_csv(full_ans_pd, "csv")
                            ])
                            put_buttons(["下载当前页（Excel）", "下载全部页（Excel）"], [
                                lambda: download_csv(ans_pd, "xlsx", current_page, max_pages),
                                lambda: download_csv(full_ans_pd, "xlsx")
                            ])
                    show_page(1)
                else:
                    with use_scope('data_scope02', clear=True): put_text("查询结果为空\n")
            elif isinstance(full_ans_pd, SQLAlchemyError):
                with use_scope('data_scope03', clear=True): put_text(f"查询失败，错误类型：{type(full_ans_pd).__name__}，错误信息：{str(full_ans_pd)}")
                mid_notes = "Code:\n```sql\n" + sql_code + "\n```\nError: " + str(full_ans_pd)
            else:
                with use_scope('data_scope04', clear=True): put_text("未知错误，查询失败。")

            # 让用户选择是否接受结果或重新查询
            if isinstance(full_ans_pd, pd.DataFrame) and not full_ans_pd.empty:
                user_choice = actions("请选择：", [
                    {'label': '重新编辑 SQL', 'value': 'retry'},
                    {'label': '重新生成 SQL', 'value': 'regen'}
                ])
            else:
                user_choice = actions("请选择：", [
                    {'label': '重新编辑 SQL', 'value': 'retry'},
                    {'label': '重新生成 SQL', 'value': 'regen'}
                ])

            if user_choice == 'accept':
                break  # 用户接受结果，跳出循环
            elif user_choice == 'retry':
                continue  # 用户选择重新编辑 SQL 代码
            elif user_choice == 'regen':
                mid_notes = textarea("请输入补充提示（如果需要）：", type=TEXT, value=mid_notes)
                with put_loading():
                    sql_code = get_sql_code(ask_request.question + mid_notes, llm)
                continue


if __name__ == '__main__':
    start_server(main, port=config_data["server_port"])
