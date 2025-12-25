"""
Digital Atelier - 服装设计管理系统 UI 设计原型
基于现代设计哲学创建的高端界面设计
"""

import sys
import io

# 设置标准输出为UTF-8编码
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib.units import mm, inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.colors import HexColor
import os

# 创建PDF
c = canvas.Canvas("F:/Dev/garment-app/Digital_Atelier_UI_Design.pdf", pagesize=A4)

# 页面尺寸
width, height = A4

# 定义调色板 - 高级时装灵感
COLORS = {
    'midnight': '#0A0E27',      # 午夜黑 - 主背景
    'electric': '#3B82F6',      # 电光蓝 - 主强调色
    'clay': '#C2410C',          # 陶土色 - 次要强调
    'sage': '#84A59D',          # 鼠尾草绿 - 中性色
    'cream': '#F5F5DC',         # 奶油色 - 浅色背景
    'gold': '#D4AF37',          # 金色 - 奢华感
    'white': '#FFFFFF',          # 白色
    'gray_light': '#E5E7EB',    # 浅灰
    'gray_medium': '#9CA3AF',   # 中灰
    'gray_dark': '#4B5563',     # 深灰
}

# 绘制背景
c.setFillColor(HexColor(COLORS['midnight']))
c.rect(0, 0, width, height, fill=True, stroke=False)

# 绘制顶部导航栏 - 极简设计
nav_height = 80
c.setFillColor(HexColor(COLORS['electric']))
c.rect(0, height - nav_height, width, nav_height, fill=True, stroke=False)

# 左上角 Logo 区域
c.setFillColor(HexColor(COLORS['white']))
c.setFont("Helvetica-Bold", 24)
c.drawString(30, height - nav_height/2 + 8, "DIGITAL ATELIER")
c.setFont("Helvetica", 10)
c.setFillColor(HexColor(COLORS['gray_light']))
c.drawString(30, height - nav_height/2 - 12, "服装设计管理系统")

# 右侧导航图标区域
nav_items = [
    ("仪表盘", 150),
    ("设计作品", 280),
    ("素材库", 410),
    ("协作", 540),
]

for item, x in nav_items:
    c.setFillColor(HexColor(COLORS['white']))
    c.setFont("Helvetica", 12)
    c.drawString(x, height - nav_height/2 + 4, item)

# 用户头像区域
c.setFillColor(HexColor(COLORS['gold']))
c.circle(width - 50, height - nav_height/2, 20, fill=True, stroke=False)

# 主内容区域边距
margin_x = 40
margin_top = 120
content_width = width - 2 * margin_x

# ===== 顶部统计卡片区域 =====
card_height = 120
card_spacing = 20
card_width = (content_width - 2 * card_spacing) / 3

stats_cards = [
    {"title": "设计作品", "value": "156", "subtitle": "+12 本月", "color": COLORS['electric']},
    {"title": "进行中项目", "value": "23", "subtitle": "7 个即将到期", "color": COLORS['clay']},
    {"title": "协作成员", "value": "8", "subtitle": "3 个在线", "color": COLORS['gold']},
]

y_pos = height - margin_top - card_height

for i, card in enumerate(stats_cards):
    x_pos = margin_x + i * (card_width + card_spacing)

    # 卡片背景 - 半透明深色
    c.setFillColor(HexColor('#1A1F3A'))
    c.rect(x_pos, y_pos, card_width, card_height, fill=True, stroke=False)

    # 顶部彩色条
    c.setFillColor(HexColor(card['color']))
    c.rect(x_pos, y_pos + card_height - 6, card_width, 6, fill=True, stroke=False)

    # 标题
    c.setFillColor(HexColor(COLORS['gray_medium']))
    c.setFont("Helvetica", 11)
    c.drawString(x_pos + 20, y_pos + card_height - 40, card['title'])

    # 数值 - 超大字号
    c.setFillColor(HexColor(COLORS['white']))
    c.setFont("Helvetica-Bold", 42)
    c.drawString(x_pos + 20, y_pos + card_height - 75, card['value'])

    # 副标题
    c.setFillColor(HexColor(card['color']))
    c.setFont("Helvetica", 10)
    c.drawString(x_pos + 20, y_pos + card_height - 20, card['subtitle'])

# ===== 主要内容区域 - 分两栏 =====
y_pos -= card_height + 50
left_column_width = (content_width - card_spacing) / 2
right_column_width = left_column_width

# 左栏 - 最近设计作品
section_height = 400

# 区域标题
c.setFillColor(HexColor(COLORS['white']))
c.setFont("Helvetica-Bold", 16)
c.drawString(margin_x, y_pos - 30, "最近设计作品")

# 背景卡片
c.setFillColor(HexColor('#1A1F3A'))
c.rect(margin_x, y_pos - section_height, left_column_width, section_height, fill=True, stroke=False)

# 设计作品列表项
design_items = [
    {"name": "2025 春季系列", "category": "成衣", "status": "设计中", "progress": 75, "color": COLORS['electric']},
    {"name": "婚纱定制", "category": "高定", "status": "审核中", "progress": 90, "color": COLORS['gold']},
    {"name": "运动系列", "category": "休闲", "status": "已完成", "progress": 100, "color": COLORS['sage']},
]

item_y = y_pos - 50
item_height = 100

for item in design_items:
    # 进度条背景
    c.setFillColor(HexColor('#0F1419'))
    c.rect(margin_x + 20, item_y - item_height + 40, left_column_width - 40, 4, fill=True, stroke=False)

    # 进度条前景
    c.setFillColor(HexColor(item['color']))
    c.rect(margin_x + 20, item_y - item_height + 40, (left_column_width - 40) * item['progress'] / 100, 4, fill=True, stroke=False)

    # 作品名称
    c.setFillColor(HexColor(COLORS['white']))
    c.setFont("Helvetica-Bold", 14)
    c.drawString(margin_x + 20, item_y - 20, item['name'])

    # 分类和状态
    c.setFillColor(HexColor(COLORS['gray_medium']))
    c.setFont("Helvetica", 10)
    c.drawString(margin_x + 20, item_y - 40, item['category'])
    c.drawString(margin_x + 100, item_y - 40, item['status'])

    # 进度百分比
    c.setFillColor(HexColor(item['color']))
    c.setFont("Helvetica-Bold", 12)
    c.drawString(margin_x + left_column_width - 60, item_y - 40, f"{item['progress']}%")

    item_y -= item_height + 20

# 右栏 - 快速操作和日历
right_y = y_pos

# 快速操作卡片
action_card_height = 200
c.setFillColor(HexColor('#1A1F3A'))
c.rect(margin_x + left_column_width + card_spacing, right_y - action_card_height,
         right_column_width, action_card_height, fill=True, stroke=False)

c.setFillColor(HexColor(COLORS['white']))
c.setFont("Helvetica-Bold", 14)
c.drawString(margin_x + left_column_width + card_spacing + 20, right_y - 170, "快速操作")

# 操作按钮
actions = [
    {"icon": "+", "text": "新建设计", "color": COLORS['electric']},
    {"icon": "↑", "text": "上传素材", "color": COLORS['gold']},
    {"icon": "◆", "text": "邀请协作", "color": COLORS['clay']},
]

action_y = right_y - 130
for action in actions:
    # 按钮背景
    c.setFillColor(HexColor(action['color'] + '20'))  # 20% 透明度
    c.rect(margin_x + left_column_width + card_spacing + 20, action_y - 35,
             right_column_width - 40, 35, fill=True, stroke=False)

    # 图标
    c.setFillColor(HexColor(action['color']))
    c.setFont("Helvetica-Bold", 20)
    c.drawString(margin_x + left_column_width + card_spacing + 30, action_y - 22, action['icon'])

    # 文字
    c.setFillColor(HexColor(COLORS['white']))
    c.setFont("Helvetica", 11)
    c.drawString(margin_x + left_column_width + card_spacing + 60, action_y - 22, action['text'])

    action_y -= 50

# 底部信息
footer_y = 80
c.setFillColor(HexColor(COLORS['gray_dark']))
c.setFont("Helvetica", 9)
c.drawString(margin_x, footer_y, "© 2025 Digital Atelier. 精心雕琢每一个像素。")

c.save()

print("✅ 设计原型已创建: F:/Dev/garment-app/Digital_Atelier_UI_Design.pdf")
print("\n📐 设计特点:")
print("- 大量留白，营造高级感")
print("- 午夜黑背景 + 电光蓝强调色")
print("- 严格的网格对齐")
print("- 极简的图标和数据展示")
print("- 现代化无衬线字体")
print("- 精心计算的视觉层次")
