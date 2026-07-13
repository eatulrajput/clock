import zoneinfo
from PyQt6.QtWidgets import (QWidget, QVBoxLayout, QHBoxLayout, QLabel, 
                             QPushButton, QComboBox, QScrollArea, QFrame, QSizePolicy)
from PyQt6.QtCore import QTimer, Qt, QSettings
from utils.helpers import get_timezone_info

class WorldClockCard(QFrame):
    def __init__(self, tz_name, on_remove, parent=None):
        super().__init__(parent)
        self.tz_name = tz_name
        self.on_remove = on_remove
        self.init_ui()

    def init_ui(self):
        self.setObjectName("WorldClockCard")
        layout = QHBoxLayout(self)
        layout.setContentsMargins(15, 12, 15, 12)
        layout.setSpacing(15)

        # Left Column: Name & Offset info
        left_layout = QVBoxLayout()
        left_layout.setSpacing(4)
        
        # Display friendly name: e.g. "New York" instead of "America/New_York"
        display_name = self.tz_name.replace("_", " ").split("/")[-1]
        self.name_label = QLabel(display_name, self)
        self.name_label.setObjectName("WorldClockName")
        
        self.full_name_label = QLabel(self.tz_name, self)
        self.full_name_label.setObjectName("WorldClockFullName")
        
        self.offset_label = QLabel("Loading...", self)
        self.offset_label.setObjectName("WorldClockOffset")
        
        left_layout.addWidget(self.name_label)
        left_layout.addWidget(self.full_name_label)
        left_layout.addWidget(self.offset_label)
        
        # Right Column: Time display & Remove button
        right_layout = QHBoxLayout()
        right_layout.setSpacing(20)
        
        self.time_label = QLabel("00:00:00 AM", self)
        self.time_label.setObjectName("WorldClockTime")
        self.time_label.setAlignment(Qt.AlignmentFlag.AlignRight | Qt.AlignmentFlag.AlignVCenter)
        
        self.remove_btn = QPushButton("×", self)
        self.remove_btn.setObjectName("WorldClockRemoveBtn")
        self.remove_btn.setFixedSize(28, 28)
        self.remove_btn.clicked.connect(lambda: self.on_remove(self))
        
        right_layout.addWidget(self.time_label)
        right_layout.addWidget(self.remove_btn)
        
        layout.addLayout(left_layout)
        layout.addStretch()
        layout.addLayout(right_layout)
        
        self.update_time()

    def update_time(self):
        info = get_timezone_info(self.tz_name)
        if info["valid"]:
            self.time_label.setText(info["time"])
            self.offset_label.setText(f"{info['date']}  •  {info['offset']}")
        else:
            self.time_label.setText("Error")
            self.offset_label.setText("Invalid Zone")


class WorldClockTab(QWidget):
    def __init__(self, parent=None):
        super().__init__(parent)
        self.cards = []
        self.settings = QSettings("LinuxClockApp", "WorldClock")
        self.init_ui()
        
    def init_ui(self):
        # Layout
        main_layout = QVBoxLayout(self)
        main_layout.setContentsMargins(20, 20, 20, 20)
        main_layout.setSpacing(15)
        
        # Top Bar: ComboBox & Add Button
        top_bar = QHBoxLayout()
        top_bar.setSpacing(10)
        
        self.tz_combo = QComboBox(self)
        self.tz_combo.setEditable(True)
        self.tz_combo.setPlaceholderText("Search and select timezone...")
        self.tz_combo.setSizePolicy(QSizePolicy.Policy.Expanding, QSizePolicy.Policy.Fixed)
        
        # Populate timezones
        all_zones = sorted(list(zoneinfo.available_timezones()))
        if not all_zones:
            # Fallback zones if zoneinfo has issues or database is empty
            all_zones = sorted([
                "UTC", "GMT", "Africa/Cairo", "Africa/Johannesburg", "America/Argentina/Buenos_Aires",
                "America/Bogota", "America/Chicago", "America/Denver", "America/Los_Angeles",
                "America/Mexico_City", "America/New_York", "America/Phoenix", "America/Sao_Paulo",
                "Asia/Bangkok", "Asia/Dubai", "Asia/Hong_Kong", "Asia/Jakarta", "Asia/Kolkata",
                "Asia/Seoul", "Asia/Shanghai", "Asia/Singapore", "Asia/Tokyo", "Australia/Sydney",
                "Europe/Amsterdam", "Europe/Berlin", "Europe/London", "Europe/Madrid", "Europe/Moscow",
                "Europe/Paris", "Europe/Rome", "Pacific/Auckland", "Pacific/Honolulu"
            ])
        
        self.tz_combo.addItems(all_zones)
        
        # Enable autocomplete filter
        self.tz_combo.setInsertPolicy(QComboBox.InsertPolicy.NoInsert)
        self.tz_combo.completer().setFilterMode(Qt.MatchFlag.MatchContains)
        
        self.add_btn = QPushButton("Add Clock", self)
        self.add_btn.setObjectName("WorldClockAddBtn")
        self.add_btn.clicked.connect(self.add_selected_timezone)
        
        top_bar.addWidget(self.tz_combo)
        top_bar.addWidget(self.add_btn)
        
        main_layout.addLayout(top_bar)
        
        # Scroll Area for clocks
        self.scroll_area = QScrollArea(self)
        self.scroll_area.setWidgetResizable(True)
        self.scroll_area.setObjectName("WorldClockScroll")
        
        self.scroll_content = QWidget()
        self.scroll_content.setObjectName("WorldClockScrollContent")
        self.scroll_layout = QVBoxLayout(self.scroll_content)
        self.scroll_layout.setAlignment(Qt.AlignmentFlag.AlignTop)
        self.scroll_layout.setSpacing(12)
        self.scroll_layout.setContentsMargins(0, 0, 0, 0)
        
        self.scroll_area.setWidget(self.scroll_content)
        main_layout.addWidget(self.scroll_area)
        
        # QTimer for updating clocks
        self.timer = QTimer(self)
        self.timer.timeout.connect(self.update_all_clocks)
        self.timer.start(500)  # Refresh every 500ms
        
        # Load saved timezones
        self.load_saved_timezones()
        
    def add_selected_timezone(self):
        tz_name = self.tz_combo.currentText().strip()
        # Verify it exists in zoneinfo
        try:
            zoneinfo.ZoneInfo(tz_name)
        except Exception:
            return
            
        # Avoid duplicate cards
        if any(card.tz_name == tz_name for card in self.cards):
            return
            
        self.create_card(tz_name)
        self.save_timezones()
        
    def create_card(self, tz_name):
        card = WorldClockCard(tz_name, self.remove_card, self)
        self.scroll_layout.addWidget(card)
        self.cards.append(card)
        
    def remove_card(self, card):
        self.scroll_layout.removeWidget(card)
        self.cards.remove(card)
        card.deleteLater()
        self.save_timezones()
        
    def update_all_clocks(self):
        for card in self.cards:
            card.update_time()
            
    def save_timezones(self):
        tz_list = [card.tz_name for card in self.cards]
        self.settings.setValue("timezones", tz_list)
        
    def load_saved_timezones(self):
        tz_list = self.settings.value("timezones")
        if tz_list:
            # QSettings can return a list or a single string depending on size
            if isinstance(tz_list, str):
                tz_list = [tz_list]
            for tz in tz_list:
                # Verify it is valid zone before rendering
                try:
                    zoneinfo.ZoneInfo(tz)
                    self.create_card(tz)
                except Exception:
                    pass
        else:
            # Default timezones on first launch
            default_zones = ["UTC", "Asia/Kolkata", "America/New_York", "Europe/London"]
            for tz in default_zones:
                try:
                    zoneinfo.ZoneInfo(tz)
                    self.create_card(tz)
                except Exception:
                    pass
            self.save_timezones()
