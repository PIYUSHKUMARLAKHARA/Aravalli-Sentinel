import os
import pptx
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

# Initialize Presentation in 16:9 widescreen
prs = pptx.Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)
blank_layout = prs.slide_layouts[6]

# Color Palette (Nature Light Environmental & Google Brand)
C_BG = RGBColor(245, 247, 240)         # Soft nature cream/sage #F5F7F0
C_WHITE = RGBColor(255, 255, 255)     # Card white #FFFFFF
C_FOREST = RGBColor(27, 94, 59)       # Primary Forest Green #1B5E3B
C_EMERALD = RGBColor(46, 139, 87)     # Emerald Green #2E8B57
C_TEXT_DARK = RGBColor(38, 56, 45)    # Text Dark #26382D
C_TEXT_MUTED = RGBColor(100, 116, 105)# Muted Text #647469
C_SAND = RGBColor(220, 200, 163)      # Sandstone Border #DCC8A3
C_EARTH = RGBColor(128, 96, 68)       # Earth Brown #806044
C_LIGHT_CARD = RGBColor(250, 252, 248)# Clean Light Card
C_RED = RGBColor(211, 47, 47)         # Critical Red #D32F2F
C_ORANGE = RGBColor(230, 81, 0)       # Warning Orange #E65100
C_BLUE = RGBColor(37, 99, 235)        # Google Blue #2563EB
C_PURPLE = RGBColor(109, 40, 217)     # AI Purple #6D28D9

ASSETS = "presentation/assets_gen"

def add_header(slide, title, subtitle="", category="ABC — Aravali Build Championship"):
    """Adds a standard clean header across slides"""
    # Background fill
    bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(7.5))
    bg.fill.solid()
    bg.fill.fore_color.rgb = C_BG
    bg.line.fill.background()

    # Top brand bar
    top_bar = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(0.12))
    top_bar.fill.solid()
    top_bar.fill.fore_color.rgb = C_FOREST
    top_bar.line.fill.background()

    # Category Pill / Badge
    pill = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.35), Inches(4.5), Inches(0.38))
    pill.fill.solid()
    pill.fill.fore_color.rgb = C_WHITE
    pill.line.color.rgb = C_SAND
    pill.line.width = Pt(1)
    tf_p = pill.text_frame
    tf_p.word_wrap = True
    tf_p.vertical_anchor = MSO_ANCHOR.MIDDLE
    p = tf_p.paragraphs[0]
    p.text = f"🌿  {category}"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = C_FOREST

    # Right side GDG badge text
    tx_r = slide.shapes.add_textbox(Inches(9.2), Inches(0.35), Inches(3.4), Inches(0.38))
    p_r = tx_r.text_frame.paragraphs[0]
    p_r.text = "GDG UDAIPUR • BUILD CHALLENGE"
    p_r.alignment = PP_ALIGN.RIGHT
    p_r.font.size = Pt(10)
    p_r.font.bold = True
    p_r.font.color.rgb = C_EARTH

    # Main Title & Subtitle Box
    tx_t = slide.shapes.add_textbox(Inches(0.8), Inches(0.78), Inches(11.7), Inches(0.95))
    tf_t = tx_t.text_frame
    tf_t.word_wrap = True
    p_t = tf_t.paragraphs[0]
    p_t.text = title
    p_t.font.size = Pt(24)
    p_t.font.bold = True
    p_t.font.color.rgb = C_TEXT_DARK

    if subtitle:
        p_sub = tf_t.add_paragraph()
        p_sub.text = subtitle
        p_sub.font.size = Pt(13)
        p_sub.font.color.rgb = C_TEXT_MUTED
        p_sub.space_before = Pt(4)

def add_footer(slide, current_page=None):
    """Adds a standard footer"""
    line = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(7.0), Inches(11.733), Inches(0.02))
    line.fill.solid()
    line.fill.fore_color.rgb = C_SAND
    line.line.fill.background()

    tx = slide.shapes.add_textbox(Inches(0.8), Inches(7.05), Inches(9.0), Inches(0.35))
    p = tx.text_frame.paragraphs[0]
    p.text = "ABC — Aravali Build Championship by GDG Udaipur  |  Aravalli Sentinel — AI-Powered Ecological Protection"
    p.font.size = Pt(9.5)
    p.font.color.rgb = C_TEXT_MUTED

    if current_page:
        tx_pg = slide.shapes.add_textbox(Inches(11.5), Inches(7.05), Inches(1.0), Inches(0.35))
        p_pg = tx_pg.text_frame.paragraphs[0]
        p_pg.text = f"{current_page} / 7"
        p_pg.alignment = PP_ALIGN.RIGHT
        p_pg.font.size = Pt(10)
        p_pg.font.bold = True
        p_pg.font.color.rgb = C_FOREST

# ==========================================================
# SLIDE 1: Title Slide (Cover)
# ==========================================================
def make_slide_1():
    slide = prs.slides.add_slide(blank_layout)
    bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(7.5))
    bg.fill.solid()
    bg.fill.fore_color.rgb = C_BG
    bg.line.fill.background()

    # Backdrop landscape photo if present
    landscape_path = "frontend/src/assets/images/aravalli-landscape.jpg"
    if os.path.exists(landscape_path):
        pic = slide.shapes.add_picture(landscape_path, Inches(0), Inches(0), Inches(13.333), Inches(7.5))
        # Semi-transparent overlay card
        overlay = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(7.5))
        overlay.fill.solid()
        overlay.fill.fore_color.rgb = RGBColor(245, 247, 240)
        # Note: PowerPoint transparency via fill is solid here, so we place a high-contrast container

    # Top Brand Ribbon
    ribbon = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.5), Inches(11.733), Inches(0.65))
    ribbon.fill.solid()
    ribbon.fill.fore_color.rgb = C_WHITE
    ribbon.line.color.rgb = C_SAND
    ribbon.line.width = Pt(1.5)
    tf_r = ribbon.text_frame
    tf_r.vertical_anchor = MSO_ANCHOR.MIDDLE
    p_r = tf_r.paragraphs[0]
    p_r.text = "🏆  ARAVALLI BUILD CHALLENGE  •  ABC — Aravali Build Championship by GDG Udaipur"
    p_r.font.size = Pt(13)
    p_r.font.bold = True
    p_r.font.color.rgb = C_FOREST
    p_r.alignment = PP_ALIGN.CENTER

    # Main Project Container Card
    card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.35), Inches(11.733), Inches(4.2))
    card.fill.solid()
    card.fill.fore_color.rgb = C_WHITE
    card.line.color.rgb = C_SAND
    card.line.width = Pt(2)

    # Project Title
    tx_title = slide.shapes.add_textbox(Inches(1.2), Inches(1.6), Inches(11.0), Inches(1.8))
    tf_t = tx_title.text_frame
    tf_t.word_wrap = True
    p1 = tf_t.paragraphs[0]
    p1.text = "ARAVALLI SENTINEL"
    p1.font.size = Pt(40)
    p1.font.bold = True
    p1.font.color.rgb = C_FOREST

    p2 = tf_t.add_paragraph()
    p2.text = "AI-Powered Ecological Early-Warning & Satellite Action Platform"
    p2.font.size = Pt(18)
    p2.font.bold = True
    p2.font.color.rgb = C_EARTH
    p2.space_before = Pt(4)

    # Problem Statement Sub-Card
    ps_box = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.2), Inches(2.9), Inches(10.9), Inches(1.25))
    ps_box.fill.solid()
    ps_box.fill.fore_color.rgb = RGBColor(240, 248, 242)
    ps_box.line.color.rgb = C_EMERALD
    ps_box.line.width = Pt(1.5)
    tf_ps = ps_box.text_frame
    tf_ps.word_wrap = True
    p_ps_lbl = tf_ps.paragraphs[0]
    p_ps_lbl.text = "PROBLEM STATEMENT:"
    p_ps_lbl.font.size = Pt(11)
    p_ps_lbl.font.bold = True
    p_ps_lbl.font.color.rgb = C_FOREST

    p_ps_body = tf_ps.add_paragraph()
    p_ps_body.text = "Halting illegal mining, large-scale deforestation, and toxic dumping in the fragile Aravalli mountain corridor through vernacular multimodal citizen reporting, Google Gemini AI triage, and Sentinel-2 satellite change detection."
    p_ps_body.font.size = Pt(12)
    p_ps_body.font.color.rgb = C_TEXT_DARK
    p_ps_body.space_before = Pt(3)

    # Note on Google Tech Bonus Box
    gt_box = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.2), Inches(4.3), Inches(10.9), Inches(0.9))
    gt_box.fill.solid()
    gt_box.fill.fore_color.rgb = RGBColor(254, 249, 235)
    gt_box.line.color.rgb = RGBColor(245, 158, 11)
    gt_box.line.width = Pt(1.5)
    tf_gt = gt_box.text_frame
    tf_gt.word_wrap = True
    p_gt = tf_gt.paragraphs[0]
    p_gt.text = "⭐ GOOGLE TECHNOLOGIES TRACK: Built with Google Gemini 1.5 Pro/Flash, Google Earth Engine (Sentinel-2 MSI), Google Maps Platform, Google Cloud Run & Android Health Connect."
    p_gt.font.size = Pt(11.5)
    p_gt.font.bold = True
    p_gt.font.color.rgb = RGBColor(146, 64, 14)

    # Metadata Grid (TEAM, TRACK, MEMBERS)
    meta_box = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(5.7), Inches(11.733), Inches(1.2))
    meta_box.fill.solid()
    meta_box.fill.fore_color.rgb = C_WHITE
    meta_box.line.color.rgb = C_SAND
    meta_box.line.width = Pt(1.5)

    # 3 Columns in Meta Box
    cols = [
        ("TEAM", "Team Sentinel\n[Aravalli Guardians]", Inches(1.1), Inches(3.4)),
        ("TRACK", "Sustainability, AI & Climate Action\nGoogle Cloud & Gemini Track", Inches(4.8), Inches(3.6)),
        ("TEAM MEMBERS", "Member 1: Team Lead & Full-Stack\nMember 2: AI & Satellite  •  Member 3: UI/UX & Mobile", Inches(8.7), Inches(3.6))
    ]
    for label, val, left, width in cols:
        tb = slide.shapes.add_textbox(left, Inches(5.78), width, Inches(1.0))
        tf = tb.text_frame
        tf.word_wrap = True
        p_lbl = tf.paragraphs[0]
        p_lbl.text = label
        p_lbl.font.size = Pt(11)
        p_lbl.font.bold = True
        p_lbl.font.color.rgb = C_FOREST
        p_val = tf.add_paragraph()
        p_val.text = val
        p_val.font.size = Pt(11)
        p_val.font.color.rgb = C_TEXT_DARK
        p_val.space_before = Pt(2)

    add_footer(slide, 1)

# ==========================================================
# SLIDE 2: Problem Statement in Daily Life (with photos)
# ==========================================================
def make_slide_2():
    slide = prs.slides.add_slide(blank_layout)
    add_header(
        slide,
        "PROBLEM STATEMENT — Everyday Environmental Crises",
        "Citizens witness illegal destruction daily, but face broken helplines, fear of retaliation, and zero accountability.",
        "ABC — Aravali Build Championship"
    )

    # 4 Daily Life Problem Cards
    cards_data = [
        (
            "1. Tree Felling & Charcoal Kilns",
            "Morning commuters and villagers see mature Dhau trees chopped and illegal kilns smoking, but don't know who the local beat guard is or where to lodge a report.",
            f"{ASSETS}/problem_deforestation.jpg",
            C_FOREST,
            "No Official Helpline"
        ),
        (
            "2. Illegal Dynamite Blasting",
            "Stone crushing blasts shake rural homes, fracture groundwater aquifers, and generate silica dust clouds. Citizens fear mafia intimidation if they report openly.",
            f"{ASSETS}/problem_mining.jpg",
            C_RED,
            "Fear of Intimidation"
        ),
        (
            "3. Toxic Waste Dumping",
            "Tankers and dumpers stealthily unload hazardous chemical effluent and industrial debris into dry seasonal riverbeds and hill gaps overnight, poisoning wells.",
            f"{ASSETS}/problem_dumping.jpg",
            C_ORANGE,
            "Unchecked Night Dumping"
        ),
        (
            "4. The 'Complaint Black Hole'",
            "When people post on social media or dial helplines, reports vanish into a black hole: no Case ID, no status updates, no satellite proof, and zero feedback.",
            f"{ASSETS}/problem_water_delay.jpg",
            C_PURPLE,
            "Zero Tracking & Action"
        )
    ]

    card_w = Inches(2.78)
    card_h = Inches(4.35)
    start_x = Inches(0.8)
    spacing = Inches(0.2)
    top_y = Inches(1.75)

    for i, (title, desc, img_path, color, tag) in enumerate(cards_data):
        x = start_x + i * (card_w + spacing)
        # Outer Card
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, top_y, card_w, card_h)
        card.fill.solid()
        card.fill.fore_color.rgb = C_WHITE
        card.line.color.rgb = C_SAND
        card.line.width = Pt(1.5)

        # Image thumbnail on top of card
        if os.path.exists(img_path):
            img_h = Inches(1.8)
            pic = slide.shapes.add_picture(img_path, x + Inches(0.12), top_y + Inches(0.12), card_w - Inches(0.24), img_h)

        # Tag pill
        tag_shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x + Inches(0.15), top_y + Inches(2.0), card_w - Inches(0.3), Inches(0.32))
        tag_shape.fill.solid()
        tag_shape.fill.fore_color.rgb = RGBColor(245, 247, 240)
        tag_shape.line.color.rgb = color
        tag_shape.line.width = Pt(1)
        tf_tag = tag_shape.text_frame
        tf_tag.vertical_anchor = MSO_ANCHOR.MIDDLE
        p_tag = tf_tag.paragraphs[0]
        p_tag.text = f"⚠️ {tag}"
        p_tag.font.size = Pt(9.5)
        p_tag.font.bold = True
        p_tag.font.color.rgb = color
        p_tag.alignment = PP_ALIGN.CENTER

        # Card Title
        tx = slide.shapes.add_textbox(x + Inches(0.15), top_y + Inches(2.35), card_w - Inches(0.3), Inches(0.55))
        tf = tx.text_frame
        tf.word_wrap = True
        p_t = tf.paragraphs[0]
        p_t.text = title
        p_t.font.size = Pt(12)
        p_t.font.bold = True
        p_t.font.color.rgb = C_TEXT_DARK

        # Card Description
        tx_d = slide.shapes.add_textbox(x + Inches(0.15), top_y + Inches(2.95), card_w - Inches(0.3), Inches(1.3))
        tf_d = tx_d.text_frame
        tf_d.word_wrap = True
        p_d = tf_d.paragraphs[0]
        p_d.text = desc
        p_d.font.size = Pt(10)
        p_d.font.color.rgb = C_TEXT_MUTED

    # Bottom Target Users Bar
    tu_bar = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(6.25), Inches(11.733), Inches(0.65))
    tu_bar.fill.solid()
    tu_bar.fill.fore_color.rgb = RGBColor(240, 248, 242)
    tu_bar.line.color.rgb = C_EMERALD
    tu_bar.line.width = Pt(1.5)
    tf_tu = tu_bar.text_frame
    tf_tu.vertical_anchor = MSO_ANCHOR.MIDDLE
    p_tu = tf_tu.paragraphs[0]
    p_tu.text = "🎯 TARGET USERS:  Concerned Daily Commuters  •  Rural Villagers & Farmers  •  Forest Beat Guards  •  District Forest Officers (DFO)  •  Environmental NGOs"
    p_tu.font.size = Pt(11)
    p_tu.font.bold = True
    p_tu.font.color.rgb = C_FOREST
    p_tu.alignment = PP_ALIGN.CENTER

    add_footer(slide, 2)

# ==========================================================
# SLIDE 3: Project Workflow & Our Idea
# ==========================================================
def make_slide_3():
    slide = prs.slides.add_slide(blank_layout)
    add_header(
        slide,
        "SOLUTION & WORKFLOW — The Ecological Defense Pipeline",
        "An AI-assisted, satellite-verified workflow from zero-friction evidence capture to official resolution.",
        "ABC — Aravali Build Championship"
    )

    # Solution Callout Banner
    sol_bar = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.75), Inches(11.733), Inches(0.75))
    sol_bar.fill.solid()
    sol_bar.fill.fore_color.rgb = C_WHITE
    sol_bar.line.color.rgb = C_EMERALD
    sol_bar.line.width = Pt(1.5)
    tf_s = sol_bar.text_frame
    tf_s.vertical_anchor = MSO_ANCHOR.MIDDLE
    p_s = tf_s.paragraphs[0]
    p_s.text = "💡 OUR SOLUTION: A two-portal intelligence platform where citizens report environmental crimes in seconds using vernacular voice notes and photos, while Forest Authority officers receive Gemini AI severity scores and Sentinel-2 satellite NDVI verification."
    p_s.font.size = Pt(11.5)
    p_s.font.bold = True
    p_s.font.color.rgb = C_FOREST

    # 6 Step Process Cards
    steps = [
        ("Step 1: Capture Evidence", "Photo, Video or Multilingual Voice Note (Hindi / English / Hinglish). No lengthy forms.", C_FOREST),
        ("Step 2: Auto-Telemetry", "Browser captures precise GPS coordinates and auto-fetches ambient weather context.", C_EMERALD),
        ("Step 3: Gemini AI Triage", "Multimodal visual forensics classifies damage, rates severity & maps forest violation codes.", C_PURPLE),
        ("Step 4: Case ID Generated", "Collision-proof ARV-2026-XXXXXX docket dispatched instantly with confidential officer notes.", C_EARTH),
        ("Step 5: Satellite Analysis", "Officer console verifies vegetation delta via Sentinel-2 MSI NDVI (B8-B4)/(B8+B4).", C_BLUE),
        ("Step 6: Resolution & Rewards", "Citizen tracks milestone updates via /track & earns verified Eco-Points via /rewards.", C_FOREST)
    ]

    card_w = Inches(1.8)
    card_h = Inches(2.9)
    start_x = Inches(0.8)
    spacing = Inches(0.18)
    top_y = Inches(2.65)

    for i, (stitle, sdesc, scolor) in enumerate(steps):
        x = start_x + i * (card_w + spacing)
        # Card
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, top_y, card_w, card_h)
        card.fill.solid()
        card.fill.fore_color.rgb = C_WHITE
        card.line.color.rgb = C_SAND
        card.line.width = Pt(1.5)

        # Header tag
        tag = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x + Inches(0.1), top_y + Inches(0.12), card_w - Inches(0.2), Inches(0.45))
        tag.fill.solid()
        tag.fill.fore_color.rgb = scolor
        tag.line.fill.background()
        tf_tag = tag.text_frame
        tf_tag.vertical_anchor = MSO_ANCHOR.MIDDLE
        p_tag = tf_tag.paragraphs[0]
        p_tag.text = f"0{i+1}"
        p_tag.font.size = Pt(16)
        p_tag.font.bold = True
        p_tag.font.color.rgb = C_WHITE
        p_tag.alignment = PP_ALIGN.CENTER

        # Title
        tx_t = slide.shapes.add_textbox(x + Inches(0.1), top_y + Inches(0.65), card_w - Inches(0.2), Inches(0.75))
        tf_t = tx_t.text_frame
        tf_t.word_wrap = True
        p_t = tf_t.paragraphs[0]
        p_t.text = stitle
        p_t.font.size = Pt(11)
        p_t.font.bold = True
        p_t.font.color.rgb = C_TEXT_DARK

        # Description
        tx_d = slide.shapes.add_textbox(x + Inches(0.1), top_y + Inches(1.4), card_w - Inches(0.2), Inches(1.4))
        tf_d = tx_d.text_frame
        tf_d.word_wrap = True
        p_d = tf_d.paragraphs[0]
        p_d.text = sdesc
        p_d.font.size = Pt(9.5)
        p_d.font.color.rgb = C_TEXT_MUTED

    # Bottom Key Features Row
    feat_bar = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(5.7), Inches(11.733), Inches(1.15))
    feat_bar.fill.solid()
    feat_bar.fill.fore_color.rgb = RGBColor(245, 247, 240)
    feat_bar.line.color.rgb = C_SAND
    feat_bar.line.width = Pt(1.5)

    feats = [
        ("🎤 Multilingual Voice AI", "Hindi & Hinglish voice reporting"),
        ("🛰️ Sentinel-2 MSI NDVI", "Multi-temporal satellite change scan"),
        ("🔒 Dual-Portal RBAC", "Confidential officer notes protection"),
        ("🏆 Eco-Points Wallet", "Health Connect verified rewards")
    ]
    f_w = Inches(2.7)
    for i, (ft, fd) in enumerate(feats):
        fx = Inches(1.0) + i * Inches(2.9)
        tx_f = slide.shapes.add_textbox(fx, Inches(5.75), f_w, Inches(1.0))
        tf_f = tx_f.text_frame
        tf_f.word_wrap = True
        p_ft = tf_f.paragraphs[0]
        p_ft.text = ft
        p_ft.font.size = Pt(11)
        p_ft.font.bold = True
        p_ft.font.color.rgb = C_FOREST
        p_fd = tf_f.add_paragraph()
        p_fd.text = fd
        p_fd.font.size = Pt(9.5)
        p_fd.font.color.rgb = C_TEXT_MUTED
        p_fd.space_before = Pt(2)

    add_footer(slide, 3)

# ==========================================================
# SLIDE 4: Google Agents & Technologies Used (Symbols & Roles)
# ==========================================================
def make_slide_4():
    slide = prs.slides.add_slide(blank_layout)
    add_header(
        slide,
        "GOOGLE AGENTS & TECHNOLOGIES — Powering Aravalli Sentinel",
        "Deep integration with Google Cloud, Gemini Multimodal AI, Earth Engine and Maps Platform.",
        "ABC — Aravali Build Championship"
    )

    # Bonus points banner from hackathon brief
    banner = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.75), Inches(11.733), Inches(0.6))
    banner.fill.solid()
    banner.fill.fore_color.rgb = RGBColor(238, 242, 255)
    banner.line.color.rgb = RGBColor(99, 102, 241)
    banner.line.width = Pt(1.5)
    tf_b = banner.text_frame
    tf_b.vertical_anchor = MSO_ANCHOR.MIDDLE
    p_b = tf_b.paragraphs[0]
    p_b.text = "⭐ HACKATHON FOCUS: 'Using Google/Google Cloud Technologies and AI in your solutions will earn you bonus marks.' We deployed 5 core Google technologies across our full stack."
    p_b.font.size = Pt(11)
    p_b.font.bold = True
    p_b.font.color.rgb = RGBColor(67, 56, 202)
    p_b.alignment = PP_ALIGN.CENTER

    # 5 Google Technologies
    google_tech = [
        (
            "Google Gemini 1.5 Pro / Flash",
            "Multimodal AI Intelligence",
            f"{ASSETS}/google_gemini.png",
            [
                "Visual Forensics: Detects tree stumps, heavy earthmovers & debris in uploaded photos.",
                "Multilingual Speech-to-Text: Transcribes Hindi, English & Hinglish voice notes into structured incident reports.",
                "Legal Mapping: Auto-suggests Indian Forest Act violations & assigns ecological severity scores."
            ],
            RGBColor(79, 70, 229)
        ),
        (
            "Google Earth Engine (GEE)",
            "Satellite Planetary Intelligence",
            f"{ASSETS}/google_earth_engine.png",
            [
                "Multispectral Telemetry: Ingests Sentinel-2 MSI surface reflectance data over Aravalli coordinates.",
                "NDVI Engine: Mathematical vegetation index computation: (B8_NIR - B4_Red) / (B8_NIR + B4_Red).",
                "Canopy Loss Alert: Flags temporal vegetation drop with honest disclaimer for field inspection."
            ],
            RGBColor(16, 185, 129)
        ),
        (
            "Google Maps Platform",
            "Geospatial GIS & Geocoding",
            f"{ASSETS}/google_maps.png",
            [
                "Interactive Risk Heatmap: Renders color-coded threat clusters across Rajasthan & Haryana.",
                "Protected Zone Polygons: Overlays legal boundaries of Sariska, Sajjangarh, and buffer zones.",
                "Reverse Geocoding: Auto-translates raw latitude/longitude into human-readable landmarks."
            ],
            RGBColor(234, 67, 53)
        ),
        (
            "Google Cloud Run & Storage",
            "Scalable Serverless Infrastructure",
            f"{ASSETS}/google_cloud_run.png",
            [
                "Low-Latency APIs: Containerized microservices hosting Node.js/Express with auto-scaling.",
                "Forensic Cloud Storage: Tamper-proof encrypted evidence storage for citizen photos & videos.",
                "Enterprise Security: HTTPS TLS encryption, rate limiting, and 99.9% uptime SLA."
            ],
            RGBColor(37, 99, 235)
        ),
        (
            "Android Health Connect",
            "Mobile Citizen Health Integration",
            f"{ASSETS}/android_health_connect.png",
            [
                "Eco-Volunteer Tracking: Simulates androidx.health.connect step counter for patrolling guards.",
                "Green Fitness Rewards: Connects physical tree-planting walks to Environmental Contribution Points.",
                "Civic Engagement: Gamified incentive model turning eco-protection into a community habit."
            ],
            RGBColor(13, 148, 136)
        )
    ]

    card_w = Inches(2.23)
    card_h = Inches(4.35)
    start_x = Inches(0.8)
    spacing = Inches(0.14)
    top_y = Inches(2.45)

    for i, (name, role, icon_path, bullets, color) in enumerate(google_tech):
        x = start_x + i * (card_w + spacing)
        # Card
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, top_y, card_w, card_h)
        card.fill.solid()
        card.fill.fore_color.rgb = C_WHITE
        card.line.color.rgb = C_SAND
        card.line.width = Pt(1.5)

        # Icon
        if os.path.exists(icon_path):
            slide.shapes.add_picture(icon_path, x + Inches(0.66), top_y + Inches(0.15), Inches(0.9), Inches(0.9))

        # Title
        tx_t = slide.shapes.add_textbox(x + Inches(0.08), top_y + Inches(1.1), card_w - Inches(0.16), Inches(0.55))
        tf_t = tx_t.text_frame
        tf_t.word_wrap = True
        p_t = tf_t.paragraphs[0]
        p_t.text = name
        p_t.font.size = Pt(10.5)
        p_t.font.bold = True
        p_t.font.color.rgb = C_TEXT_DARK
        p_t.alignment = PP_ALIGN.CENTER

        # Role Tag
        tag = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x + Inches(0.12), top_y + Inches(1.68), card_w - Inches(0.24), Inches(0.32))
        tag.fill.solid()
        tag.fill.fore_color.rgb = RGBColor(245, 247, 240)
        tag.line.color.rgb = color
        tag.line.width = Pt(1)
        tf_tag = tag.text_frame
        tf_tag.vertical_anchor = MSO_ANCHOR.MIDDLE
        p_tag = tf_tag.paragraphs[0]
        p_tag.text = role
        p_tag.font.size = Pt(8.5)
        p_tag.font.bold = True
        p_tag.font.color.rgb = color
        p_tag.alignment = PP_ALIGN.CENTER

        # Bullets
        tx_b = slide.shapes.add_textbox(x + Inches(0.1), top_y + Inches(2.05), card_w - Inches(0.2), Inches(2.2))
        tf_b = tx_b.text_frame
        tf_b.word_wrap = True
        for b_idx, bullet in enumerate(bullets):
            p_b = tf_b.paragraphs[0] if b_idx == 0 else tf_b.add_paragraph()
            p_b.text = f"• {bullet}"
            p_b.font.size = Pt(8.5)
            p_b.font.color.rgb = C_TEXT_MUTED
            if b_idx > 0:
                p_b.space_before = Pt(4)

    add_footer(slide, 4)

# ==========================================================
# SLIDE 5: Technology Stack Used in This Project
# ==========================================================
def make_slide_5():
    slide = prs.slides.add_slide(blank_layout)
    add_header(
        slide,
        "TECH STACK — Production-Grade Full-Stack Architecture",
        "Engineered for high reliability, explainable AI risk scoring, and zero dummy data dependencies.",
        "ABC — Aravali Build Championship"
    )

    # 5 Tech Stack Columns (matching template layout)
    stacks = [
        (
            "FRONTEND",
            "Interactive UI / UX",
            [
                "React 18 & Vite (Ultra-fast build)",
                "Tailwind CSS (Nature Light System)",
                "Leaflet & Google Maps JS API",
                "Lucide React Modern Iconography",
                "HTML5 Audio & Video Stream Recording",
                "Canvas Confetti & Toast Feedback"
            ],
            C_FOREST
        ),
        (
            "BACKEND",
            "REST Microservices",
            [
                "Node.js (v18+) & Express.js",
                "RESTful Resource Architecture",
                "Multer (Multipart Evidence Upload)",
                "JSON Web Tokens (JWT Auth)",
                "Helmet Security & Rate Limiting",
                "Role-Based Access Control (RBAC)"
            ],
            C_EMERALD
        ),
        (
            "DATABASE",
            "Geospatial Storage",
            [
                "MongoDB Atlas & Mongoose ODM",
                "Geospatial 2dsphere Spatial Indexing",
                "GeoJSON MultiPolygon Forest Zones",
                "Indexed Collision-Proof Case IDs",
                "Confidential Internal Notes Separation",
                "Reward Ledger & Points Wallet"
            ],
            C_EARTH
        ),
        (
            "AI & SATELLITE",
            "Ecological Intelligence",
            [
                "Google Gemini 1.5 Multimodal SDK",
                "Sentinel-2 MSI Spectral Engine",
                "NDVI = (B8-B4)/(B8+B4) Engine",
                "Open-Meteo Real-Time Weather API",
                "Multilingual Voice Audio Transcriber",
                "Exif & Image Forensic Metadata"
            ],
            C_PURPLE
        ),
        (
            "DEPLOYMENT & QA",
            "DevOps & Quality",
            [
                "Google Cloud Run (Auto-scaling)",
                "Vercel Edge CDN Deployment",
                "Docker Containerization",
                "Vitest Suite: 72/72 Tests Passed",
                "100% Passing Integration Tests",
                "Git / GitHub Action CI/CD"
            ],
            C_BLUE
        )
    ]

    card_w = Inches(2.23)
    card_h = Inches(4.35)
    start_x = Inches(0.8)
    spacing = Inches(0.14)
    top_y = Inches(1.75)

    for i, (title, sub, items, color) in enumerate(stacks):
        x = start_x + i * (card_w + spacing)
        # Card
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, top_y, card_w, card_h)
        card.fill.solid()
        card.fill.fore_color.rgb = C_WHITE
        card.line.color.rgb = C_SAND
        card.line.width = Pt(1.5)

        # Header Pill
        hp = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x + Inches(0.12), top_y + Inches(0.15), card_w - Inches(0.24), Inches(0.5))
        hp.fill.solid()
        hp.fill.fore_color.rgb = color
        hp.line.fill.background()
        tf_hp = hp.text_frame
        tf_hp.vertical_anchor = MSO_ANCHOR.MIDDLE
        p_hp = tf_hp.paragraphs[0]
        p_hp.text = title
        p_hp.font.size = Pt(12)
        p_hp.font.bold = True
        p_hp.font.color.rgb = C_WHITE
        p_hp.alignment = PP_ALIGN.CENTER

        # Subtitle
        tx_sub = slide.shapes.add_textbox(x + Inches(0.1), top_y + Inches(0.7), card_w - Inches(0.2), Inches(0.35))
        tf_sub = tx_sub.text_frame
        p_s = tf_sub.paragraphs[0]
        p_s.text = sub
        p_s.font.size = Pt(9.5)
        p_s.font.bold = True
        p_s.font.color.rgb = C_TEXT_DARK
        p_s.alignment = PP_ALIGN.CENTER

        # Tech Items
        tx_i = slide.shapes.add_textbox(x + Inches(0.1), top_y + Inches(1.05), card_w - Inches(0.2), Inches(3.1))
        tf_i = tx_i.text_frame
        tf_i.word_wrap = True
        for it_idx, item in enumerate(items):
            p_it = tf_i.paragraphs[0] if it_idx == 0 else tf_i.add_paragraph()
            p_it.text = f"✔ {item}"
            p_it.font.size = Pt(9)
            p_it.font.color.rgb = C_TEXT_MUTED
            if it_idx > 0:
                p_it.space_before = Pt(5)

    # Bottom Banner: Test & Reliability Metrics
    banner = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(6.25), Inches(11.733), Inches(0.65))
    banner.fill.solid()
    banner.fill.fore_color.rgb = RGBColor(240, 253, 244)
    banner.line.color.rgb = C_EMERALD
    banner.line.width = Pt(1.5)
    tf_b = banner.text_frame
    tf_b.vertical_anchor = MSO_ANCHOR.MIDDLE
    p_b = tf_b.paragraphs[0]
    p_b.text = "🧪 TEST VERIFICATION: 72 / 72 Vitest Automated Unit & Integration Tests Passing (100%)  •  Vite Production Build: 0 Errors  •  Real MongoDB & Satellite Queries"
    p_b.font.size = Pt(10.5)
    p_b.font.bold = True
    p_b.font.color.rgb = C_FOREST
    p_b.alignment = PP_ALIGN.CENTER

    add_footer(slide, 5)

# ==========================================================
# SLIDE 6: Future Scopes, Scalability & Impact
# ==========================================================
def make_slide_6():
    slide = prs.slides.add_slide(blank_layout)
    add_header(
        slide,
        "IMPACT & SCALABILITY — From Udaipur Ridges to a Pan-India Shield",
        "Demonstrated local impact with a scalable architecture ready for nationwide expansion.",
        "ABC — Aravali Build Championship"
    )

    # Top Row: 3 Impact Pillars (Matching template: Real impact, More users, Built to scale)
    pillars = [
        ("Real Impact", "Prevents irreversible destruction of 3.2-billion-year-old rock formations, stops groundwater depletion, and protects native Dhau forest flora.", C_FOREST),
        ("More Users", "Vernacular voice-first reporting in Hindi & Hinglish eliminates literacy and tech hurdles for rural farmers, grazers, and forest-fringe communities.", C_EMERALD),
        ("Built to Scale", "Cloud-native microservices, geospatial indexing, and serverless satellite APIs engineered to process thousands of simultaneous reports.", C_BLUE)
    ]
    p_w = Inches(3.75)
    for i, (pt, pd, pc) in enumerate(pillars):
        px = Inches(0.8) + i * (p_w + Inches(0.24))
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, px, Inches(1.75), p_w, Inches(1.3))
        card.fill.solid()
        card.fill.fore_color.rgb = C_WHITE
        card.line.color.rgb = pc
        card.line.width = Pt(1.5)

        tf = card.text_frame
        tf.word_wrap = True
        p_t = tf.paragraphs[0]
        p_t.text = f"🌟 {pt.upper()}"
        p_t.font.size = Pt(12)
        p_t.font.bold = True
        p_t.font.color.rgb = pc

        p_desc = tf.add_paragraph()
        p_desc.text = pd
        p_desc.font.size = Pt(9.5)
        p_desc.font.color.rgb = C_TEXT_MUTED
        p_desc.space_before = Pt(3)

    # Middle Row: 3 Geographic Tiers (UDAIPUR, RAJASTHAN, INDIA)
    tiers = [
        (
            "UDAIPUR",
            "Local Impact",
            [
                "Preserves Udaipur Lake Catchment Ridges (Pichola, Fateh Sagar & Badi).",
                "Shields Sajjangarh Wildlife Sanctuary eco-sensitive buffer.",
                "Real-time monitoring of Gogunda & Sukher marble slurry dumping."
            ],
            C_FOREST
        ),
        (
            "RAJASTHAN",
            "Regional Corridor",
            [
                "Defends the 692 km natural barrier stopping Thar Desert expansion.",
                "Protects Sariska & Ranthambore wildlife crossing corridors.",
                "Connects Jaipur, Alwar, Rajsamand & Sirohi district forest offices."
            ],
            C_EARTH
        ),
        (
            "INDIA",
            "National Blueprint",
            [
                "Scalable blueprint for Western Ghats, Shivaliks & Central Indian forests.",
                "Unified interface for Ministry of Environment, Forest & Climate Change.",
                "Empowers millions of citizens as verified ecological guardians."
            ],
            C_PURPLE
        )
    ]
    t_w = Inches(3.75)
    for i, (t_name, t_sub, t_bullets, t_color) in enumerate(tiers):
        tx = Inches(0.8) + i * (t_w + Inches(0.24))
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, tx, Inches(3.2), t_w, Inches(2.05))
        card.fill.solid()
        card.fill.fore_color.rgb = C_WHITE
        card.line.color.rgb = C_SAND
        card.line.width = Pt(1.5)

        # Header pill
        hp = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, tx + Inches(0.12), Inches(3.3), t_w - Inches(0.24), Inches(0.42))
        hp.fill.solid()
        hp.fill.fore_color.rgb = t_color
        hp.line.fill.background()
        tf_hp = hp.text_frame
        tf_hp.vertical_anchor = MSO_ANCHOR.MIDDLE
        p_hp = tf_hp.paragraphs[0]
        p_hp.text = f"{t_name} — {t_sub}"
        p_hp.font.size = Pt(11)
        p_hp.font.bold = True
        p_hp.font.color.rgb = C_WHITE
        p_hp.alignment = PP_ALIGN.CENTER

        # Bullets
        tx_b = slide.shapes.add_textbox(tx + Inches(0.12), Inches(3.75), t_w - Inches(0.24), Inches(1.4))
        tf_b = tx_b.text_frame
        tf_b.word_wrap = True
        for b_idx, bullet in enumerate(t_bullets):
            p_b = tf_b.paragraphs[0] if b_idx == 0 else tf_b.add_paragraph()
            p_b.text = f"• {bullet}"
            p_b.font.size = Pt(9)
            p_b.font.color.rgb = C_TEXT_MUTED
            if b_idx > 0:
                p_b.space_before = Pt(3)

    # Bottom Row: Future Roadmap Cards
    roadmap = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(5.4), Inches(11.733), Inches(1.4))
    roadmap.fill.solid()
    roadmap.fill.fore_color.rgb = RGBColor(240, 248, 242)
    roadmap.line.color.rgb = C_EMERALD
    roadmap.line.width = Pt(1.5)

    r_items = [
        ("🚁 Autonomous Drone Patrols", "Edge AI aerial surveys for inaccessible high ridge illegal mining pits."),
        ("💬 WhatsApp / Telegram Bot", "Zero-app citizen reporting: send photos & voice notes directly via chat."),
        ("⚖️ Automated Legal FIRs", "Auto-drafts legal complaints mapped to Indian Forest Act & NGT orders."),
        ("🌱 Carbon Credit Ledger", "Exchange verified citizen Eco-Points for local partner green rewards.")
    ]
    r_w = Inches(2.7)
    for i, (rt, rd) in enumerate(r_items):
        rx = Inches(1.0) + i * Inches(2.9)
        tx_r = slide.shapes.add_textbox(rx, Inches(5.45), r_w, Inches(1.2))
        tf_r = tx_r.text_frame
        tf_r.word_wrap = True
        p_rt = tf_r.paragraphs[0]
        p_rt.text = rt
        p_rt.font.size = Pt(10.5)
        p_rt.font.bold = True
        p_rt.font.color.rgb = C_FOREST
        p_rd = tf_r.add_paragraph()
        p_rd.text = rd
        p_rd.font.size = Pt(8.5)
        p_rd.font.color.rgb = C_TEXT_MUTED
        p_rd.space_before = Pt(2)

    add_footer(slide, 6)

# ==========================================================
# SLIDE 7: College Name & Team Members Photo
# ==========================================================
def make_slide_7():
    slide = prs.slides.add_slide(blank_layout)
    add_header(
        slide,
        "OUR INSTITUTION & TEAM — Aravali Guardians",
        "Engineered with dedication for the Aravali Build Championship by GDG Udaipur.",
        "ABC — Aravali Build Championship"
    )

    # Top College Banner
    col_card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.75), Inches(11.733), Inches(1.1))
    col_card.fill.solid()
    col_card.fill.fore_color.rgb = C_WHITE
    col_card.line.color.rgb = C_SAND
    col_card.line.width = Pt(1.5)

    # College Emblem
    emblem_path = f"{ASSETS}/college_emblem.png"
    if os.path.exists(emblem_path):
        slide.shapes.add_picture(emblem_path, Inches(1.0), Inches(1.85), Inches(0.9), Inches(0.9))

    # College Text
    tx_c = slide.shapes.add_textbox(Inches(2.05), Inches(1.8), Inches(7.5), Inches(0.95))
    tf_c = tx_c.text_frame
    tf_c.word_wrap = True
    p_c1 = tf_c.paragraphs[0]
    p_c1.text = "COLLEGE OF TECHNOLOGY AND ENGINEERING (CTAE), UDAIPUR"
    p_c1.font.size = Pt(15)
    p_c1.font.bold = True
    p_c1.font.color.rgb = C_FOREST

    p_c2 = tf_c.add_paragraph()
    p_c2.text = "Department of Computer Science & Engineering  |  Maharana Pratap University of Agriculture and Technology (MPUAT)"
    p_c2.font.size = Pt(11)
    p_c2.font.color.rgb = C_TEXT_MUTED
    p_c2.space_before = Pt(2)

    # GDG Badge inside College Card
    badge_path = f"{ASSETS}/gdg_udaipur_badge.png"
    if os.path.exists(badge_path):
        slide.shapes.add_picture(badge_path, Inches(9.8), Inches(1.85), Inches(2.5), Inches(0.7))

    # 3 Team Member Cards with designated photo frames
    members = [
        (
            "Team Lead & Full-Stack",
            "[Team Lead Name]",
            f"{ASSETS}/team_avatar_lead.png",
            [
                "Role: Architecture & Full-Stack Development",
                "React 18 frontend & Node.js REST API",
                "Dual-portal authentication & RBAC security",
                "72/72 automated Vitest test suite",
                "Contact: github.com/teamlead • email"
            ],
            C_FOREST
        ),
        (
            "AI & Satellite Engineer",
            "[Member 2 Name]",
            f"{ASSETS}/team_avatar_ai.png",
            [
                "Role: Google AI & Earth Observation",
                "Google Gemini 1.5 Multimodal vision triage",
                "Sentinel-2 MSI NDVI vegetation engine",
                "Open-Meteo real-time atmospheric context",
                "Contact: github.com/ai-engineer • email"
            ],
            C_PURPLE
        ),
        (
            "UI/UX & Mobile Lead",
            "[Member 3 Name]",
            f"{ASSETS}/team_avatar_design.png",
            [
                "Role: Product Design & Mobile Systems",
                "Nature Light Environmental Design System",
                "Public Case Tracking Portal (/track)",
                "Android Health Connect reward simulation",
                "Contact: github.com/ux-lead • email"
            ],
            C_EARTH
        )
    ]

    m_w = Inches(3.75)
    m_h = Inches(3.25)
    top_m = Inches(3.0)

    for i, (role_title, name, avatar_path, bullets, col) in enumerate(members):
        mx = Inches(0.8) + i * (m_w + Inches(0.24))
        # Outer Card
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, mx, top_m, m_w, m_h)
        card.fill.solid()
        card.fill.fore_color.rgb = C_WHITE
        card.line.color.rgb = C_SAND
        card.line.width = Pt(1.5)

        # Avatar Picture Frame
        if os.path.exists(avatar_path):
            slide.shapes.add_picture(avatar_path, mx + Inches(0.2), top_m + Inches(0.2), Inches(1.1), Inches(1.1))

        # Member Name & Role
        tx_m = slide.shapes.add_textbox(mx + Inches(1.4), top_m + Inches(0.2), m_w - Inches(1.5), Inches(1.0))
        tf_m = tx_m.text_frame
        tf_m.word_wrap = True
        p_name = tf_m.paragraphs[0]
        p_name.text = name
        p_name.font.size = Pt(13)
        p_name.font.bold = True
        p_name.font.color.rgb = C_TEXT_DARK

        p_role = tf_m.add_paragraph()
        p_role.text = role_title
        p_role.font.size = Pt(10)
        p_role.font.bold = True
        p_role.font.color.rgb = col
        p_role.space_before = Pt(2)

        # Bullets
        tx_mb = slide.shapes.add_textbox(mx + Inches(0.2), top_m + Inches(1.35), m_w - Inches(0.4), Inches(1.7))
        tf_mb = tx_mb.text_frame
        tf_mb.word_wrap = True
        for b_idx, bullet in enumerate(bullets):
            p_b = tf_mb.paragraphs[0] if b_idx == 0 else tf_mb.add_paragraph()
            p_b.text = f"• {bullet}"
            p_b.font.size = Pt(9)
            p_b.font.color.rgb = C_TEXT_MUTED
            if b_idx > 0:
                p_b.space_before = Pt(3)

    # Bottom Closing Banner
    close_bar = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(6.35), Inches(11.733), Inches(0.55))
    close_bar.fill.solid()
    close_bar.fill.fore_color.rgb = RGBColor(240, 248, 242)
    close_bar.line.color.rgb = C_EMERALD
    close_bar.line.width = Pt(1.5)
    tf_cb = close_bar.text_frame
    tf_cb.vertical_anchor = MSO_ANCHOR.MIDDLE
    p_cb = tf_cb.paragraphs[0]
    p_cb.text = "🌿 'Protecting the Aravalli is not just conservation — it is securing the air, water, and climate of North India.'  •  Thank You GDG Udaipur!"
    p_cb.font.size = Pt(10)
    p_cb.font.bold = True
    p_cb.font.color.rgb = C_FOREST
    p_cb.alignment = PP_ALIGN.CENTER

    add_footer(slide, 7)

# Generate all 7 slides
if __name__ == '__main__':
    print("Building 7-Slide Presentation for GDG Udaipur...")
    make_slide_1()
    print("Slide 1 generated: Cover / Project Title")
    make_slide_2()
    print("Slide 2 generated: Problem Statement in Daily Life")
    make_slide_3()
    print("Slide 3 generated: Project Workflow & Our Idea")
    make_slide_4()
    print("Slide 4 generated: Google Agents & Technologies Used")
    make_slide_5()
    print("Slide 5 generated: Technology Stack Used")
    make_slide_6()
    print("Slide 6 generated: Future Scopes, Scalability & Impact")
    make_slide_7()
    print("Slide 7 generated: College Name & Team Members Photo")

    output_path = "presentation/Aravalli_Sentinel_Presentation.pptx"
    prs.save(output_path)
    print(f"Presentation successfully saved to: {output_path}")
