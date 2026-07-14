import zoneinfo
import math
from datetime import datetime
from PyQt6.QtWidgets import (QWidget, QVBoxLayout, QHBoxLayout, QLabel, 
                             QPushButton, QComboBox, QScrollArea, QFrame, QSizePolicy)
from PyQt6.QtCore import QTimer, Qt, QSettings

def get_friendly_location(tz_name: str) -> str:
    mapping = {
        "Europe/London": "London, United Kingdom",
        "America/New_York": "New York, United States",
        "Asia/Kolkata": "Kolkata, India",
        "America/Los_Angeles": "Los Angeles, United States",
        "Europe/Paris": "Paris, France",
        "Asia/Tokyo": "Tokyo, Japan",
        "Asia/Singapore": "Singapore",
        "UTC": "Coordinated Universal Time",
        "GMT": "Greenwich Mean Time",
        "America/Chicago": "Chicago, United States",
        "America/Denver": "Denver, United States",
        "America/Phoenix": "Phoenix, United States",
        "America/Sao_Paulo": "São Paulo, Brazil",
        "Asia/Hong_Kong": "Hong Kong, China",
        "Asia/Shanghai": "Shanghai, China",
        "Asia/Seoul": "Seoul, South Korea",
        "Australia/Sydney": "Sydney, Australia",
        "Europe/Berlin": "Berlin, Germany",
        "Europe/Moscow": "Moscow, Russia",
        "Pacific/Auckland": "Auckland, New Zealand",
    }
    if tz_name in mapping:
        return mapping[tz_name]
    
    # Fallback formatting: e.g. "Africa/Cairo" -> "Cairo, Africa"
    parts = tz_name.split("/")
    if len(parts) >= 2:
        city = parts[-1].replace("_", " ")
        country = parts[0].replace("_", " ")
        return f"{city}, {country}"
    return tz_name


class WorldClockCard(QFrame):
    def __init__(self, tz_name, on_remove, parent_tab, parent=None):
        super().__init__(parent)
        self.tz_name = tz_name
        self.on_remove = on_remove
        self.parent_tab = parent_tab
        self.is_selected = False
        self.init_ui()

    def init_ui(self):
        self.setObjectName("WorldClockCard")
        self.setFixedSize(210, 110)
        
        main_layout = QVBoxLayout(self)
        main_layout.setContentsMargins(15, 12, 15, 12)
        main_layout.setSpacing(0)
        
        # Top Row: City Name, UTC offset, and Remove button
        top_row = QHBoxLayout()
        top_row.setSpacing(5)
        
        display_name = self.tz_name.replace("_", " ").split("/")[-1]
        self.name_label = QLabel(display_name, self)
        self.name_label.setObjectName("CardCityName")
        
        self.offset_label = QLabel(self)
        self.offset_label.setObjectName("CardOffset")
        self.offset_label.setAlignment(Qt.AlignmentFlag.AlignRight | Qt.AlignmentFlag.AlignVCenter)
        
        self.remove_btn = QPushButton("×", self)
        self.remove_btn.setObjectName("CardRemoveBtn")
        self.remove_btn.setFixedSize(18, 18)
        self.remove_btn.clicked.connect(lambda: self.on_remove(self))
        
        top_row.addWidget(self.name_label)
        top_row.addStretch()
        top_row.addWidget(self.offset_label)
        top_row.addWidget(self.remove_btn)
        
        main_layout.addLayout(top_row)
        main_layout.addStretch()
        
        # Bottom Row: Clock Time and Day/Night badge
        bottom_row = QHBoxLayout()
        bottom_row.setSpacing(5)
        
        self.time_label = QLabel("00:00", self)
        self.time_label.setObjectName("CardTime")
        
        self.day_night_label = QLabel(self)
        self.day_night_label.setObjectName("CardDayNight")
        self.day_night_label.setAlignment(Qt.AlignmentFlag.AlignRight | Qt.AlignmentFlag.AlignVCenter)
        
        bottom_row.addWidget(self.time_label)
        bottom_row.addStretch()
        bottom_row.addWidget(self.day_night_label)
        
        main_layout.addLayout(bottom_row)
        self.update_style()

    def mousePressEvent(self, event):
        if event.button() == Qt.MouseButton.LeftButton:
            self.parent_tab.select_card(self)
        super().mousePressEvent(event)

    def set_selected(self, selected):
        self.is_selected = selected
        self.update_style()

    def update_style(self):
        theme = self.parent_tab.theme_mode
        if theme == "light":
            if self.is_selected:
                self.setStyleSheet("""
                    QFrame#WorldClockCard {
                        background-color: #000000;
                        border: none;
                        border-radius: 14px;
                    }
                    QLabel {
                        color: #ffffff;
                        background: transparent;
                    }
                    QLabel#CardCityName {
                        font-weight: bold;
                        font-size: 13px;
                    }
                    QLabel#CardOffset {
                        color: #a1a1aa;
                        font-size: 10px;
                        font-weight: 500;
                    }
                    QLabel#CardTime {
                        font-size: 26px;
                        font-weight: 800;
                    }
                    QLabel#CardDayNight {
                        font-size: 11px;
                        font-weight: 600;
                    }
                    QPushButton#CardRemoveBtn {
                        border: none;
                        background: transparent;
                        color: #71717a;
                        font-weight: bold;
                        font-size: 12px;
                        border-radius: 9px;
                    }
                    QPushButton#CardRemoveBtn:hover {
                        color: #ef4444;
                        background-color: #27272a;
                    }
                """)
            else:
                self.setStyleSheet("""
                    QFrame#WorldClockCard {
                        background-color: #e2e8f0;
                        border: 1px solid #cbd5e1;
                        border-radius: 14px;
                    }
                    QFrame#WorldClockCard:hover {
                        border-color: #94a3b8;
                        background-color: #f1f5f9;
                    }
                    QLabel {
                        color: #0f172a;
                        background: transparent;
                    }
                    QLabel#CardCityName {
                        font-weight: bold;
                        font-size: 13px;
                    }
                    QLabel#CardOffset {
                        color: #64748b;
                        font-size: 10px;
                        font-weight: 500;
                    }
                    QLabel#CardTime {
                        font-size: 26px;
                        font-weight: 800;
                    }
                    QLabel#CardDayNight {
                        font-weight: 600;
                        font-size: 11px;
                        color: #475569;
                    }
                    QPushButton#CardRemoveBtn {
                        border: none;
                        background: transparent;
                        color: #94a3b8;
                        font-weight: bold;
                        font-size: 12px;
                        border-radius: 9px;
                    }
                    QPushButton#CardRemoveBtn:hover {
                        color: #ef4444;
                        background-color: #cbd5e1;
                    }
                """)
        else:
            # Dark theme
            if self.is_selected:
                self.setStyleSheet("""
                    QFrame#WorldClockCard {
                        background-color: #ffffff;
                        border: none;
                        border-radius: 14px;
                    }
                    QLabel {
                        color: #0b0f19;
                        background: transparent;
                    }
                    QLabel#CardCityName {
                        font-weight: bold;
                        font-size: 13px;
                    }
                    QLabel#CardOffset {
                        color: #71717a;
                        font-size: 10px;
                        font-weight: 600;
                    }
                    QLabel#CardTime {
                        font-size: 26px;
                        font-weight: 800;
                    }
                    QLabel#CardDayNight {
                        font-size: 11px;
                        font-weight: 600;
                    }
                    QPushButton#CardRemoveBtn {
                        border: none;
                        background: transparent;
                        color: #a1a1aa;
                        font-weight: bold;
                        font-size: 12px;
                        border-radius: 9px;
                    }
                    QPushButton#CardRemoveBtn:hover {
                        color: #ef4444;
                        background-color: #f4f4f5;
                    }
                """)
            else:
                self.setStyleSheet("""
                    QFrame#WorldClockCard {
                        background-color: #131927;
                        border: 1px solid #1e293b;
                        border-radius: 14px;
                    }
                    QFrame#WorldClockCard:hover {
                        border-color: #6366f1;
                        background-color: #172033;
                    }
                    QLabel {
                        color: #f8fafc;
                        background: transparent;
                    }
                    QLabel#CardCityName {
                        font-weight: bold;
                        font-size: 13px;
                    }
                    QLabel#CardOffset {
                        color: #94a3b8;
                        font-size: 10px;
                        font-weight: 500;
                    }
                    QLabel#CardTime {
                        font-size: 26px;
                        font-weight: 800;
                    }
                    QLabel#CardDayNight {
                        font-weight: 600;
                        font-size: 11px;
                        color: #94a3b8;
                    }
                    QPushButton#CardRemoveBtn {
                        border: none;
                        background: transparent;
                        color: #4b5563;
                        font-weight: bold;
                        font-size: 12px;
                        border-radius: 9px;
                    }
                    QPushButton#CardRemoveBtn:hover {
                        color: #f87171;
                        background-color: #1f2937;
                    }
                """)

    def update_time(self, is_24h):
        try:
            tz = zoneinfo.ZoneInfo(self.tz_name)
            now_tz = datetime.now(tz)
            
            fmt = "%H:%M" if is_24h else "%I:%M"
            time_str = now_tz.strftime(fmt)
            if not is_24h and time_str.startswith("0"):
                time_str = time_str[1:]
            self.time_label.setText(time_str)
            
            offset_sec = now_tz.utcoffset().total_seconds() if now_tz.utcoffset() is not None else 0
            offset_hours = offset_sec / 3600.0
            sign = "+" if offset_hours >= 0 else "-"
            val = f"{abs(offset_hours):.1f}"
            if val.endswith(".0"):
                val = val[:-2]
            self.offset_label.setText(f"UTC{sign}{val}")
            
            h = now_tz.hour
            if 6 <= h < 18:
                self.day_night_label.setText("☀️ Day")
            else:
                self.day_night_label.setText("🌙 Night")
        except Exception:
            self.time_label.setText("Error")


class WorldClockTab(QWidget):
    def __init__(self, parent=None):
        super().__init__(parent)
        self.cards = []
        self.selected_card = None
        self.selected_tz = None
        
        self.settings = QSettings("LinuxClockApp", "WorldClock")
        self.theme_mode = self.settings.value("theme_mode", "light")
        
        is_24h_val = self.settings.value("is_24h", False)
        self.is_24h = True if str(is_24h_val).lower() == 'true' or is_24h_val is True else False
        
        self.init_ui()
        self.load_saved_timezones()
        self.update_theme_styles()

    def init_ui(self):
        main_layout = QVBoxLayout(self)
        main_layout.setContentsMargins(24, 20, 24, 20)
        main_layout.setSpacing(14)
        
        # 1. Header Row: Logo, Search, Navigation Buttons
        header_layout = QHBoxLayout()
        header_layout.setSpacing(15)
        
        self.logo_label = QLabel("⏰ TimeSpot", self)
        
        self.search_combo = QComboBox(self)
        self.search_combo.setEditable(True)
        self.search_combo.setPlaceholderText("Search city/timezone...")
        self.search_combo.setSizePolicy(QSizePolicy.Policy.Expanding, QSizePolicy.Policy.Fixed)
        
        all_zones = sorted(list(zoneinfo.available_timezones()))
        if not all_zones:
            all_zones = sorted([
                "UTC", "GMT", "Africa/Cairo", "Africa/Johannesburg", "America/Argentina/Buenos_Aires",
                "America/Bogota", "America/Chicago", "America/Denver", "America/Los_Angeles",
                "America/Mexico_City", "America/New_York", "America/Phoenix", "America/Sao_Paulo",
                "Asia/Bangkok", "Asia/Dubai", "Asia/Hong_Kong", "Asia/Jakarta", "Asia/Kolkata",
                "Asia/Seoul", "Asia/Shanghai", "Asia/Singapore", "Asia/Tokyo", "Australia/Sydney",
                "Europe/Amsterdam", "Europe/Berlin", "Europe/London", "Europe/Madrid", "Europe/Moscow",
                "Europe/Paris", "Europe/Rome", "Pacific/Auckland", "Pacific/Honolulu"
            ])
        self.search_combo.addItems(all_zones)
        self.search_combo.setInsertPolicy(QComboBox.InsertPolicy.NoInsert)
        self.search_combo.completer().setFilterMode(Qt.MatchFlag.MatchContains)
        
        self.login_btn = QPushButton("Log In", self)
        self.get_app_btn = QPushButton("Get the App", self)
        self.get_app_btn.setFixedSize(90, 30)
        
        header_layout.addWidget(self.logo_label)
        header_layout.addWidget(self.search_combo)
        header_layout.addWidget(self.login_btn)
        header_layout.addWidget(self.get_app_btn)
        
        main_layout.addLayout(header_layout)
        main_layout.addSpacing(5)
        
        # 2. Big Clock Display (Time Display and Subtitles)
        self.big_clock_label = QLabel("00:00:00", self)
        self.big_clock_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        main_layout.addWidget(self.big_clock_label)
        
        # Info sub-row: "Current", Sunrise/Sunset estimates, Date, and Toggle controls
        info_layout = QHBoxLayout()
        
        self.current_indicator = QLabel("Current", self)
        
        self.solar_label = QLabel(self)
        self.solar_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        
        self.date_label = QLabel(self)
        self.date_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        
        # Center metadata layouts
        center_meta = QVBoxLayout()
        center_meta.setSpacing(2)
        center_meta.addWidget(self.solar_label)
        center_meta.addWidget(self.date_label)
        
        # Controls (12h/24h toggle & Light/Dark theme toggle)
        controls_layout = QHBoxLayout()
        controls_layout.setSpacing(10)
        
        # 12h/24h segmented layout
        self.format_toggle_frame = QFrame(self)
        self.format_toggle_frame.setFixedSize(92, 28)
        f_lay = QHBoxLayout(self.format_toggle_frame)
        f_lay.setContentsMargins(2, 2, 2, 2)
        f_lay.setSpacing(0)
        
        self.btn_12h = QPushButton("12h", self.format_toggle_frame)
        self.btn_12h.setFixedSize(44, 24)
        self.btn_12h.clicked.connect(self.set_format_12h)
        
        self.btn_24h = QPushButton("24h", self.format_toggle_frame)
        self.btn_24h.setFixedSize(44, 24)
        self.btn_24h.clicked.connect(self.set_format_24h)
        
        f_lay.addWidget(self.btn_12h)
        f_lay.addWidget(self.btn_24h)
        
        # Light/Dark segmented layout
        self.theme_toggle_frame = QFrame(self)
        self.theme_toggle_frame.setFixedSize(102, 28)
        t_lay = QHBoxLayout(self.theme_toggle_frame)
        t_lay.setContentsMargins(2, 2, 2, 2)
        t_lay.setSpacing(0)
        
        self.btn_light = QPushButton("Light", self.theme_toggle_frame)
        self.btn_light.setFixedSize(49, 24)
        self.btn_light.clicked.connect(self.set_theme_light)
        
        self.btn_dark = QPushButton("Dark", self.theme_toggle_frame)
        self.btn_dark.setFixedSize(49, 24)
        self.btn_dark.clicked.connect(self.set_theme_dark)
        
        t_lay.addWidget(self.btn_light)
        t_lay.addWidget(self.btn_dark)
        
        controls_layout.addWidget(self.format_toggle_frame)
        controls_layout.addWidget(self.theme_toggle_frame)
        
        info_layout.addWidget(self.current_indicator)
        info_layout.addStretch()
        info_layout.addLayout(center_meta)
        info_layout.addStretch()
        info_layout.addLayout(controls_layout)
        
        main_layout.addLayout(info_layout)
        
        # 3. Horizontal Divider
        self.divider = QFrame(self)
        self.divider.setFrameShape(QFrame.Shape.HLine)
        self.divider.setFrameShadow(QFrame.Shadow.Plain)
        self.divider.setFixedHeight(1)
        main_layout.addWidget(self.divider)
        main_layout.addSpacing(5)
        
        # 4. Details bar: Selection name, Quote, and Add Button
        details_layout = QHBoxLayout()
        
        self.selected_location_label = QLabel("No Timezone Selected", self)
        
        self.quote_label = QLabel("Life moves fast. Stay on time and enjoy every moment!", self)
        self.quote_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        
        self.add_btn = QPushButton("Add Another City +", self)
        self.add_btn.setFixedSize(140, 32)
        self.add_btn.clicked.connect(self.add_selected_timezone)
        
        details_layout.addWidget(self.selected_location_label)
        details_layout.addStretch()
        details_layout.addWidget(self.quote_label)
        details_layout.addStretch()
        details_layout.addWidget(self.add_btn)
        
        main_layout.addLayout(details_layout)
        
        # 5. Horizontal Scroll row of cards
        self.scroll_area = QScrollArea(self)
        self.scroll_area.setWidgetResizable(True)
        self.scroll_area.setObjectName("WorldClockScroll")
        self.scroll_area.setFrameShape(QFrame.Shape.NoFrame)
        self.scroll_area.setVerticalScrollBarPolicy(Qt.ScrollBarPolicy.ScrollBarAlwaysOff)
        self.scroll_area.setHorizontalScrollBarPolicy(Qt.ScrollBarPolicy.ScrollBarAsNeeded)
        
        self.scroll_content = QWidget()
        self.scroll_content.setObjectName("WorldClockScrollContent")
        self.scroll_layout = QHBoxLayout(self.scroll_content)
        self.scroll_layout.setAlignment(Qt.AlignmentFlag.AlignLeft)
        self.scroll_layout.setSpacing(12)
        self.scroll_layout.setContentsMargins(2, 2, 2, 2)
        
        self.scroll_area.setWidget(self.scroll_content)
        main_layout.addWidget(self.scroll_area)
        
        # Background updates timer
        self.timer = QTimer(self)
        self.timer.timeout.connect(self.update_all_clocks)
        self.timer.start(500)

    def select_card(self, card):
        self.selected_card = card
        self.selected_tz = card.tz_name
        
        for c in self.cards:
            c.set_selected(c == card)
            
        self.update_big_display()

    def add_selected_timezone(self):
        tz_name = self.search_combo.currentText().strip()
        try:
            zoneinfo.ZoneInfo(tz_name)
        except Exception:
            return
            
        if any(card.tz_name == tz_name for card in self.cards):
            # Select already existing card instead of duplicate
            existing = [c for c in self.cards if c.tz_name == tz_name][0]
            self.select_card(existing)
            return
            
        self.create_card(tz_name)
        self.save_timezones()
        self.select_card(self.cards[-1])

    def create_card(self, tz_name):
        card = WorldClockCard(tz_name, self.remove_card, self, self)
        self.scroll_layout.addWidget(card)
        self.cards.append(card)

    def remove_card(self, card):
        is_selected = (self.selected_card == card)
        
        self.scroll_layout.removeWidget(card)
        self.cards.remove(card)
        card.deleteLater()
        
        if is_selected:
            if self.cards:
                self.select_card(self.cards[0])
            else:
                self.selected_card = None
                self.selected_tz = None
                self.update_big_display()
                
        self.save_timezones()

    def update_all_clocks(self):
        for card in self.cards:
            card.update_time(self.is_24h)
        self.update_big_display_time()

    def update_big_display(self):
        if not self.selected_tz:
            self.big_clock_label.setText("--:--:--")
            self.selected_location_label.setText("No Timezone Selected")
            self.solar_label.setText("")
            self.date_label.setText("")
            return
            
        self.selected_location_label.setText(get_friendly_location(self.selected_tz))
        self.update_big_display_time()

    def update_big_display_time(self):
        if not self.selected_tz:
            return
            
        try:
            tz = zoneinfo.ZoneInfo(self.selected_tz)
            now_tz = datetime.now(tz)
            
            # Format time digits
            fmt = "%H:%M:%S" if self.is_24h else "%I:%M:%S %p"
            self.big_clock_label.setText(now_tz.strftime(fmt))
            
            # Update Date Label
            self.date_label.setText(now_tz.strftime("%A, %b %d %Y"))
            
            # Calculate simulated Sun / Daylight times
            day_of_year = now_tz.timetuple().tm_yday
            is_southern = any(x in self.selected_tz for x in ["Australia", "South", "Argentina", "Brazil", "Johannesburg", "Auckland", "Sydney"])
            h_sign = -1.0 if is_southern else 1.0
            
            # Amplitude solar variations
            seasonal_shift = 1.5 * math.sin(2 * math.pi * (day_of_year - 80) / 365) * h_sign
            sr_local = 6.25 - seasonal_shift
            ss_local = 18.5 + seasonal_shift
            
            sr_m, sr_h = math.modf(sr_local)
            ss_m, ss_h = math.modf(ss_local)
            
            sr_str = f"{int(sr_h):02d}:{abs(int(sr_m * 60)):02d}"
            ss_str = f"{int(ss_h):02d}:{abs(int(ss_m * 60)):02d}"
            
            dur_h = int(ss_local - sr_local)
            dur_m = int(((ss_local - sr_local) - dur_h) * 60)
            
            self.solar_label.setText(f"Sun ☀️ : {sr_str} - {ss_str} ({dur_h}h {dur_m:02d}m)")
            
        except Exception:
            self.big_clock_label.setText("Error")

    def set_format_12h(self):
        self.is_24h = False
        self.settings.setValue("is_24h", False)
        self.update_all_clocks()
        self.update_segmented_styles()

    def set_format_24h(self):
        self.is_24h = True
        self.settings.setValue("is_24h", True)
        self.update_all_clocks()
        self.update_segmented_styles()

    def set_theme_light(self):
        if self.window() and hasattr(self.window(), "set_theme"):
            self.window().set_theme("light")
        else:
            self.theme_mode = "light"
            self.settings.setValue("theme_mode", "light")
            self.update_theme_styles()

    def set_theme_dark(self):
        if self.window() and hasattr(self.window(), "set_theme"):
            self.window().set_theme("dark")
        else:
            self.theme_mode = "dark"
            self.settings.setValue("theme_mode", "dark")
            self.update_theme_styles()

    def update_segmented_styles(self):
        theme = self.theme_mode
        if theme == "light":
            self.format_toggle_frame.setStyleSheet("background-color: #dfdfdf; border-radius: 12px; border: none;")
            self.theme_toggle_frame.setStyleSheet("background-color: #dfdfdf; border-radius: 12px; border: none;")
            
            active_style = "background-color: #ffffff; color: #000000; font-weight: bold; border-radius: 10px; border: none; font-size: 10px;"
            inactive_style = "background-color: transparent; color: #71717a; border: none; font-size: 10px;"
            
            self.btn_12h.setStyleSheet(active_style if not self.is_24h else inactive_style)
            self.btn_24h.setStyleSheet(inactive_style if not self.is_24h else active_style)
            
            self.btn_light.setStyleSheet(active_style if self.theme_mode == "light" else inactive_style)
            self.btn_dark.setStyleSheet(inactive_style if self.theme_mode == "light" else active_style)
        else:
            self.format_toggle_frame.setStyleSheet("background-color: #131927; border-radius: 12px; border: none;")
            self.theme_toggle_frame.setStyleSheet("background-color: #131927; border-radius: 12px; border: none;")
            
            active_style = "background-color: #1e293b; color: #f8fafc; font-weight: bold; border-radius: 10px; border: 1px solid #312e81; font-size: 10px;"
            inactive_style = "background-color: transparent; color: #94a3b8; border: none; font-size: 10px;"
            
            self.btn_12h.setStyleSheet(active_style if not self.is_24h else inactive_style)
            self.btn_24h.setStyleSheet(inactive_style if not self.is_24h else active_style)
            
            self.btn_light.setStyleSheet(active_style if self.theme_mode == "light" else inactive_style)
            self.btn_dark.setStyleSheet(inactive_style if self.theme_mode == "light" else active_style)

    def update_theme_styles(self, theme_mode=None):
        if theme_mode:
            self.theme_mode = theme_mode
        theme = self.theme_mode
        self.update_segmented_styles()
        
        if theme == "light":
            self.setStyleSheet("background-color: #f3f4f6; color: #0f172a;")
            
            self.logo_label.setStyleSheet("color: #000000; font-size: 16px; font-weight: 800; letter-spacing: 0.5px; border: none; background: transparent;")
            self.search_combo.setStyleSheet("""
                QComboBox {
                    background-color: #e2e8f0;
                    border: 1px solid #cbd5e1;
                    border-radius: 12px;
                    padding: 6px 12px;
                    color: #0f172a;
                }
                QComboBox:focus {
                    border-color: #6366f1;
                    background-color: #ffffff;
                }
                QComboBox::drop-down {
                    border: none;
                }
                QComboBox QAbstractItemView {
                    background-color: #ffffff;
                    border: 1px solid #cbd5e1;
                    selection-background-color: #6366f1;
                    selection-color: #ffffff;
                    color: #0f172a;
                }
            """)
            
            self.add_btn.setStyleSheet("""
                QPushButton {
                    background-color: #6366f1;
                    color: #ffffff;
                    border: none;
                    border-radius: 12px;
                    padding: 6px 12px;
                    font-weight: bold;
                }
                QPushButton:hover {
                    background-color: #4f46e5;
                }
            """)
            
            self.get_app_btn.setStyleSheet("""
                QPushButton {
                    background-color: #000000;
                    color: #ffffff;
                    border: none;
                    border-radius: 12px;
                    padding: 6px 12px;
                    font-weight: bold;
                    font-size: 11px;
                }
                QPushButton:hover {
                    background-color: #27272a;
                }
            """)
            self.login_btn.setStyleSheet("color: #475569; font-weight: 600; font-size: 12px; border: none; background: transparent;")
            
            self.big_clock_label.setStyleSheet("font-size: 96px; font-weight: 800; color: #000000; letter-spacing: -3px; font-family: -apple-system, sans-serif; border: none; background: transparent;")
            self.current_indicator.setStyleSheet("color: #64748b; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; border: none; background: transparent;")
            self.solar_label.setStyleSheet("color: #475569; font-size: 12px; font-weight: 600; border: none; background: transparent;")
            self.date_label.setStyleSheet("color: #475569; font-size: 12px; font-weight: 600; border: none; background: transparent;")
            
            self.divider.setStyleSheet("background-color: #cbd5e1;")
            
            self.selected_location_label.setStyleSheet("font-size: 26px; font-weight: 800; color: #000000; letter-spacing: -0.5px; border: none; background: transparent;")
            self.quote_label.setStyleSheet("color: #64748b; font-size: 12px; font-style: italic; font-weight: 500; border: none; background: transparent;")
            
            self.scroll_area.setStyleSheet("background-color: transparent; border: none;")
            self.scroll_content.setStyleSheet("background-color: transparent; border: none;")
            
        else:
            self.setStyleSheet("background-color: #0b0f19; color: #f8fafc;")
            
            self.logo_label.setStyleSheet("color: #ffffff; font-size: 16px; font-weight: 800; letter-spacing: 0.5px; border: none; background: transparent;")
            self.search_combo.setStyleSheet("""
                QComboBox {
                    background-color: #131927;
                    border: 1px solid #1e293b;
                    border-radius: 12px;
                    padding: 6px 12px;
                    color: #f8fafc;
                }
                QComboBox:focus {
                    border-color: #6366f1;
                    background-color: #172033;
                }
                QComboBox::drop-down {
                    border: none;
                }
                QComboBox QAbstractItemView {
                    background-color: #131927;
                    border: 1px solid #1e293b;
                    selection-background-color: #312e81;
                    selection-color: #ffffff;
                    color: #f8fafc;
                }
            """)
            
            self.add_btn.setStyleSheet("""
                QPushButton {
                    background-color: #6366f1;
                    color: #ffffff;
                    border: none;
                    border-radius: 12px;
                    padding: 6px 12px;
                    font-weight: bold;
                }
                QPushButton:hover {
                    background-color: #4f46e5;
                }
            """)
            
            self.get_app_btn.setStyleSheet("""
                QPushButton {
                    background-color: #ffffff;
                    color: #0b0f19;
                    border: none;
                    border-radius: 12px;
                    padding: 6px 12px;
                    font-weight: bold;
                    font-size: 11px;
                }
                QPushButton:hover {
                    background-color: #e2e8f0;
                }
            """)
            self.login_btn.setStyleSheet("color: #94a3b8; font-weight: 600; font-size: 12px; border: none; background: transparent;")
            
            self.big_clock_label.setStyleSheet("font-size: 96px; font-weight: 800; color: #ffffff; letter-spacing: -3px; font-family: -apple-system, sans-serif; border: none; background: transparent;")
            self.current_indicator.setStyleSheet("color: #94a3b8; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; border: none; background: transparent;")
            self.solar_label.setStyleSheet("color: #94a3b8; font-size: 12px; font-weight: 600; border: none; background: transparent;")
            self.date_label.setStyleSheet("color: #94a3b8; font-size: 12px; font-weight: 600; border: none; background: transparent;")
            
            self.divider.setStyleSheet("background-color: #1e293b;")
            
            self.selected_location_label.setStyleSheet("font-size: 26px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px; border: none; background: transparent;")
            self.quote_label.setStyleSheet("color: #94a3b8; font-size: 12px; font-style: italic; font-weight: 500; border: none; background: transparent;")
            
            self.scroll_area.setStyleSheet("background-color: transparent; border: none;")
            self.scroll_content.setStyleSheet("background-color: transparent; border: none;")

        for card in self.cards:
            card.update_style()

    def save_timezones(self):
        tz_list = [card.tz_name for card in self.cards]
        self.settings.setValue("timezones", tz_list)
        
    def load_saved_timezones(self):
        tz_list = self.settings.value("timezones")
        if tz_list:
            if isinstance(tz_list, str):
                tz_list = [tz_list]
            for tz in tz_list:
                try:
                    zoneinfo.ZoneInfo(tz)
                    self.create_card(tz)
                except Exception:
                    pass
        else:
            default_zones = ["UTC", "Asia/Kolkata", "America/New_York", "Europe/London"]
            for tz in default_zones:
                try:
                    zoneinfo.ZoneInfo(tz)
                    self.create_card(tz)
                except Exception:
                    pass
            self.save_timezones()
            
        if self.cards:
            self.select_card(self.cards[0])
