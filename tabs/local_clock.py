from PyQt6.QtWidgets import QWidget, QVBoxLayout, QLabel, QFrame
from PyQt6.QtCore import QTimer, Qt, QDateTime

class LocalClockTab(QWidget):
    def __init__(self, parent=None):
        super().__init__(parent)
        self.init_ui()
        
    def init_ui(self):
        # Main Layout with generous margins
        layout = QVBoxLayout(self)
        layout.setAlignment(Qt.AlignmentFlag.AlignCenter)
        layout.setContentsMargins(30, 40, 30, 40)
        
        # Clock Container (Card)
        card = QFrame(self)
        card.setObjectName("ClockCard")
        card_layout = QVBoxLayout(card)
        card_layout.setAlignment(Qt.AlignmentFlag.AlignCenter)
        card_layout.setSpacing(20)
        card_layout.setContentsMargins(50, 50, 50, 50)
        
        # Sub-title header inside card
        self.title_label = QLabel("🕒 SYSTEM LOCAL TIME", self)
        self.title_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        self.title_label.setStyleSheet("color: #6366f1; font-size: 12px; font-weight: 700; letter-spacing: 2px;")
        
        # Time Label with tabular monospace feel
        self.time_label = QLabel("00:00:00", self)
        self.time_label.setObjectName("TimeLabel")
        self.time_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        self.time_label.setStyleSheet("font-size: 80px; font-weight: 800; letter-spacing: -2px;")
        
        # Date Label
        self.date_label = QLabel("Loading date...", self)
        self.date_label.setObjectName("DateLabel")
        self.date_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        self.date_label.setStyleSheet("font-size: 16px; font-weight: 600; letter-spacing: 0.5px;")
        
        # Timezone Label
        try:
            from datetime import datetime
            local_tz = datetime.now().astimezone().tzname() or "Local Time"
        except Exception:
            local_tz = "Local Time"
        self.tz_label = QLabel(f"🌐 Timezone: {local_tz}", self)
        self.tz_label.setObjectName("LocalTzLabel")
        self.tz_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        self.tz_label.setStyleSheet("color: #64748b; font-size: 13px; font-weight: 600; letter-spacing: 0.5px; margin-top: 5px;")
        
        card_layout.addWidget(self.title_label)
        card_layout.addWidget(self.time_label)
        card_layout.addWidget(self.date_label)
        card_layout.addWidget(self.tz_label)
        
        layout.addWidget(card)
        
        # Setup Timer for 100ms updates
        self.timer = QTimer(self)
        self.timer.timeout.connect(self.update_time)
        self.timer.start(100)
        
        # Run update once immediately
        self.update_time()
        
    def update_time(self):
        current_datetime = QDateTime.currentDateTime()
        self.time_label.setText(current_datetime.toString("HH:mm:ss"))
        self.date_label.setText(current_datetime.toString("dddd, MMMM d, yyyy"))

    def update_theme_styles(self, theme_mode: str):
        if theme_mode == "light":
            self.title_label.setStyleSheet("color: #4f46e5; font-size: 12px; font-weight: 700; letter-spacing: 2px;")
            self.tz_label.setStyleSheet("color: #475569; font-size: 13px; font-weight: 600; letter-spacing: 0.5px; margin-top: 5px;")
        else:
            self.title_label.setStyleSheet("color: #818cf8; font-size: 12px; font-weight: 700; letter-spacing: 2px;")
            self.tz_label.setStyleSheet("color: #94a3b8; font-size: 13px; font-weight: 600; letter-spacing: 0.5px; margin-top: 5px;")
