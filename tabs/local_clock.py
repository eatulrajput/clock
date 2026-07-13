from PyQt6.QtWidgets import QWidget, QVBoxLayout, QLabel, QFrame
from PyQt6.QtCore import QTimer, Qt, QDateTime

class LocalClockTab(QWidget):
    def __init__(self, parent=None):
        super().__init__(parent)
        self.init_ui()
        
    def init_ui(self):
        # Main Layout
        layout = QVBoxLayout(self)
        layout.setAlignment(Qt.AlignmentFlag.AlignCenter)
        layout.setContentsMargins(20, 20, 20, 20)
        
        # Clock Container (Card)
        card = QFrame(self)
        card.setObjectName("ClockCard")
        card_layout = QVBoxLayout(card)
        card_layout.setAlignment(Qt.AlignmentFlag.AlignCenter)
        card_layout.setSpacing(15)
        card_layout.setContentsMargins(40, 40, 40, 40)
        
        # Time Label
        self.time_label = QLabel("00:00:00", self)
        self.time_label.setObjectName("TimeLabel")
        self.time_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        
        # Date Label
        self.date_label = QLabel("Loading date...", self)
        self.date_label.setObjectName("DateLabel")
        self.date_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        
        card_layout.addWidget(self.time_label)
        card_layout.addWidget(self.date_label)
        
        layout.addWidget(card)
        
        # Setup Timer for 100ms updates
        self.timer = QTimer(self)
        self.timer.timeout.connect(self.update_time)
        self.timer.start(100)
        
        # Run update once immediately
        self.update_time()
        
    def update_time(self):
        current_datetime = QDateTime.currentDateTime()
        # Digital 24-hour format (e.g. 13:45:02) or 12-hour format depending on preference.
        # Let's use 24-hour HH:mm:ss as standard, or customizable. HH:mm:ss is clean and digital.
        self.time_label.setText(current_datetime.toString("HH:mm:ss"))
        
        # Date format (e.g., Monday, July 13, 2026)
        self.date_label.setText(current_datetime.toString("dddd, MMMM d, yyyy"))
