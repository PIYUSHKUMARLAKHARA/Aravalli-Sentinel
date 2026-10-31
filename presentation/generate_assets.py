import os
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ASSETS_DIR = 'presentation/assets_gen'
os.makedirs(ASSETS_DIR, exist_ok=True)

def create_google_gemini():
    size = (400, 400)
    im = Image.new('RGBA', size, (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.ellipse([10, 10, 390, 390], fill=(238, 242, 255, 255), outline=(199, 210, 254, 255), width=8)
    cx, cy = 200, 200
    points = []
    for i in range(360):
        rad = math.radians(i)
        r = 145 / ((math.cos(rad)**4 + math.sin(rad)**4)**0.25)
        points.append((cx + r * math.cos(rad) * 0.85, cy + r * math.sin(rad) * 0.85))
    d.polygon(points, fill=(67, 56, 202, 255))
    points_inner = []
    for i in range(360):
        rad = math.radians(i)
        r = 85 / ((math.cos(rad)**4 + math.sin(rad)**4)**0.25)
        points_inner.append((cx + r * math.cos(rad) * 0.85, cy + r * math.sin(rad) * 0.85))
    d.polygon(points_inner, fill=(147, 51, 234, 255))
    d.ellipse([170, 170, 230, 230], fill=(255, 255, 255, 255))
    im.save(f'{ASSETS_DIR}/google_gemini.png')
    print('Created google_gemini.png')

def create_google_earth_engine():
    size = (400, 400)
    im = Image.new('RGBA', size, (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.ellipse([10, 10, 390, 390], fill=(240, 253, 244, 255), outline=(187, 247, 208, 255), width=8)
    # Earth globe
    d.ellipse([90, 90, 310, 310], fill=(34, 197, 94, 255), outline=(21, 128, 61, 255), width=6)
    # Continents stylized
    d.ellipse([130, 130, 210, 200], fill=(16, 185, 129, 255))
    d.ellipse([200, 180, 280, 270], fill=(16, 185, 129, 255))
    # Orbital ring
    d.arc([40, 130, 360, 270], start=200, end=340, fill=(37, 99, 235, 255), width=10)
    d.arc([40, 130, 360, 270], start=20, end=160, fill=(37, 99, 235, 255), width=10)
    # Satellite
    d.rectangle([320, 120, 350, 150], fill=(245, 158, 11, 255), outline=(180, 83, 9, 255), width=3)
    d.line([305, 135, 365, 135], fill=(59, 130, 246, 255), width=5)
    im.save(f'{ASSETS_DIR}/google_earth_engine.png')
    print('Created google_earth_engine.png')

def create_google_maps():
    size = (400, 400)
    im = Image.new('RGBA', size, (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.ellipse([10, 10, 390, 390], fill=(254, 242, 242, 255), outline=(254, 202, 202, 255), width=8)
    # Map pin
    d.ellipse([130, 60, 270, 200], fill=(234, 67, 53, 255))
    d.polygon([(133, 160), (267, 160), (200, 310)], fill=(234, 67, 53, 255))
    d.ellipse([165, 95, 235, 165], fill=(255, 255, 255, 255))
    # Google map pin inner dot
    d.ellipse([180, 110, 220, 150], fill=(66, 133, 244, 255))
    # Pin shadow
    d.ellipse([160, 315, 240, 340], fill=(203, 213, 225, 200))
    im.save(f'{ASSETS_DIR}/google_maps.png')
    print('Created google_maps.png')

def create_google_cloud_run():
    size = (400, 400)
    im = Image.new('RGBA', size, (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.ellipse([10, 10, 390, 390], fill=(239, 246, 255, 255), outline=(191, 219, 254, 255), width=8)
    # Cloud body
    d.ellipse([100, 150, 220, 270], fill=(66, 133, 244, 255))
    d.ellipse([180, 110, 300, 230], fill=(66, 133, 244, 255))
    d.ellipse([230, 160, 320, 270], fill=(66, 133, 244, 255))
    d.rectangle([150, 200, 280, 270], fill=(66, 133, 244, 255))
    # Run Play icon / container symbol in center
    d.polygon([(190, 170), (190, 230), (240, 200)], fill=(255, 255, 255, 255))
    im.save(f'{ASSETS_DIR}/google_cloud_run.png')
    print('Created google_cloud_run.png')

def create_android_health_connect():
    size = (400, 400)
    im = Image.new('RGBA', size, (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.ellipse([10, 10, 390, 390], fill=(240, 253, 250, 255), outline=(153, 246, 228, 255), width=8)
    # Shield shape
    d.polygon([(200, 70), (310, 110), (300, 240), (200, 320), (100, 240), (90, 110)], fill=(13, 148, 136, 255))
    # Heart inside shield
    d.ellipse([140, 140, 200, 200], fill=(255, 255, 255, 255))
    d.ellipse([200, 140, 260, 200], fill=(255, 255, 255, 255))
    d.polygon([(142, 175), (258, 175), (200, 245)], fill=(255, 255, 255, 255))
    # Android Green accents
    d.ellipse([175, 170, 225, 215], fill=(52, 168, 83, 255))
    im.save(f'{ASSETS_DIR}/android_health_connect.png')
    print('Created android_health_connect.png')

def create_gdg_badge():
    size = (600, 160)
    im = Image.new('RGBA', size, (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    # Background rounded pill
    d.rounded_rectangle([5, 5, 595, 155], radius=25, fill=(255, 255, 255, 240), outline=(220, 200, 163, 255), width=3)
    # 4 Google color bars on left
    d.rectangle([25, 30, 37, 130], fill=(66, 133, 244, 255))  # Blue
    d.rectangle([41, 30, 53, 130], fill=(234, 67, 53, 255))  # Red
    d.rectangle([57, 30, 69, 130], fill=(251, 188, 5, 255))  # Yellow
    d.rectangle([73, 30, 85, 130], fill=(52, 168, 83, 255))  # Green
    # Text
    try:
        font_lg = ImageFont.truetype("arialbd.ttf", 36)
        font_sm = ImageFont.truetype("arial.ttf", 22)
    except:
        font_lg = font_sm = None
    d.text((105, 35), "GDG UDAIPUR", fill=(38, 56, 45, 255), font=font_lg)
    d.text((105, 85), "Aravali Build Championship (ABC)", fill=(27, 94, 59, 255), font=font_sm)
    im.save(f'{ASSETS_DIR}/gdg_udaipur_badge.png')
    print('Created gdg_udaipur_badge.png')

def create_college_emblem():
    size = (400, 400)
    im = Image.new('RGBA', size, (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.ellipse([10, 10, 390, 390], fill=(245, 247, 240, 255), outline=(27, 94, 59, 255), width=10)
    d.ellipse([30, 30, 370, 370], outline=(220, 200, 163, 255), width=4)
    # Academic Cap / Building
    d.polygon([(200, 100), (320, 160), (200, 220), (80, 160)], fill=(27, 94, 59, 255))
    d.rectangle([150, 220, 250, 245], fill=(27, 94, 59, 255))
    d.line([300, 165, 300, 240], fill=(217, 119, 6, 255), width=6)
    d.ellipse([292, 235, 308, 255], fill=(217, 119, 6, 255))
    # Laurel leaves base
    d.arc([80, 180, 320, 340], start=30, end=150, fill=(46, 139, 87, 255), width=8)
    im.save(f'{ASSETS_DIR}/college_emblem.png')
    print('Created college_emblem.png')

def create_team_avatars():
    roles = [
        ('team_avatar_lead.png', 'TL', (27, 94, 59)),
        ('team_avatar_ai.png', 'AI', (67, 56, 202)),
        ('team_avatar_design.png', 'UX', (180, 83, 9))
    ]
    for filename, initials, color in roles:
        size = (400, 400)
        im = Image.new('RGBA', size, (0, 0, 0, 0))
        d = ImageDraw.Draw(im)
        d.ellipse([10, 10, 390, 390], fill=(245, 247, 240, 255), outline=color, width=10)
        # Silhouette body
        d.ellipse([130, 80, 270, 220], fill=color)
        d.chord([70, 210, 330, 440], start=0, end=180, fill=color)
        # Initials badge in bottom right
        d.ellipse([260, 260, 370, 370], fill=(255, 255, 255, 255), outline=color, width=6)
        try:
            f = ImageFont.truetype("arialbd.ttf", 46)
        except:
            f = None
        d.text((285, 288), initials, fill=color, font=f)
        im.save(f'{ASSETS_DIR}/{filename}')
        print(f'Created {filename}')

def crop_and_frame_problem_images():
    images = [
        ('datasets/citizen_reports/images/deforestation_dhau_01.jpg', 'problem_deforestation.jpg'),
        ('datasets/citizen_reports/images/mining_blasting_01.jpg', 'problem_mining.jpg'),
        ('datasets/citizen_reports/images/debris_dumping_01.jpg', 'problem_dumping.jpg'),
        ('datasets/citizen_reports/images/water_table_drop_01.jpg', 'problem_water_delay.jpg'),
    ]
    for src, dst in images:
        if os.path.exists(src):
            try:
                im = Image.open(src).convert('RGB')
                # crop to 4:3 ratio
                w, h = im.size
                target_ratio = 4.0 / 3.0
                curr_ratio = w / float(h)
                if curr_ratio > target_ratio:
                    new_w = int(h * target_ratio)
                    offset = (w - new_w) // 2
                    im = im.crop((offset, 0, offset + new_w, h))
                else:
                    new_h = int(w / target_ratio)
                    offset = (h - new_h) // 2
                    im = im.crop((0, offset, w, offset + new_h))
                im = im.resize((600, 450), Image.Resampling.LANCZOS)
                im.save(f'{ASSETS_DIR}/{dst}', quality=92)
                print(f'Cropped and saved {dst}')
            except Exception as e:
                print(f'Error processing {src}: {e}')

if __name__ == '__main__':
    create_google_gemini()
    create_google_earth_engine()
    create_google_maps()
    create_google_cloud_run()
    create_android_health_connect()
    create_gdg_badge()
    create_college_emblem()
    create_team_avatars()
    crop_and_frame_problem_images()
    print('All presentation assets successfully generated!')
