import sys
from PyQt6.QtWidgets import QApplication, QMainWindow, QTabWidget, QWidget, QVBoxLayout
from PyQt6.QtGui import QFont
from PyQt6.QtCore import Qt

from tabs.local_clock import LocalClockTab
from tabs.world_clock import WorldClockTab
from tabs.alarm_clock import AlarmClockTab
from tabs.stopwatch import StopwatchTab
from tabs.timer import TimerTab

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Linux Multi-Clock")
        self.setMinimumSize(550, 600)
        self.init_ui()

    def init_ui(self):
        # Central widget and layout
        central_widget = QWidget(self)
        self.setCentralWidget(central_widget)
        main_layout = QVBoxLayout(central_widget)
        main_layout.setContentsMargins(10, 10, 10, 10)

        # Tab Widget
        self.tabs = QTabWidget(self)
        self.tabs.setObjectName("MainTabs")
        self.tabs.setDocumentMode(True)  # cleaner look

        # Add tabs
        self.local_clock_tab = LocalClockTab(self)
        self.world_clock_tab = WorldClockTab(self)
        self.alarm_clock_tab = AlarmClockTab(self)
        self.stopwatch_tab = StopwatchTab(self)
        self.timer_tab = TimerTab(self)

        self.tabs.addTab(self.local_clock_tab, "Local Clock")
        self.tabs.addTab(self.world_clock_tab, "World Clock")
        self.tabs.addTab(self.alarm_clock_tab, "Alarm Clock")
        self.tabs.addTab(self.stopwatch_tab, "Stopwatch")
        self.tabs.addTab(self.timer_tab, "Timer")

        main_layout.addWidget(self.tabs)

        # Apply dark mode style sheet
        self.setStyleSheet(self.get_stylesheet())

    def get_stylesheet(self) -> str:
        return """
            /* Global Application Styles */
            QWidget {
                background-color: #121212;
                color: #ffffff;
                font-family: 'Inter', 'Segoe UI', 'Helvetica', 'Arial', sans-serif;
                font-size: 14px;
            }
            
            /* Tab Widget Styling */
            QTabWidget::pane {
                border: none;
                background-color: #121212;
            }
            
            QTabBar::tab {
                background-color: #181818;
                color: #b3b3b3;
                padding: 12px 20px;
                font-weight: 600;
                font-size: 13px;
                border-bottom: 2px solid transparent;
            }
            
            QTabBar::tab:hover {
                color: #ffffff;
                background-color: #1f1f1f;
            }
            
            QTabBar::tab:selected {
                color: #00d2ff;
                background-color: #121212;
                border-bottom: 2px solid #00d2ff;
            }
            
            /* QFrame Containers (Cards) */
            QFrame#ClockCard {
                background-color: #1e1e1e;
                border: 1px solid #2c2c2c;
                border-radius: 16px;
            }
            
            QFrame#WorldClockCard {
                background-color: #1e1e1e;
                border: 1px solid #2c2c2c;
                border-radius: 12px;
            }
            
            QFrame#TimerDisplayFrame {
                background-color: #1e1e1e;
                border-radius: 16px;
                border: 1px solid #2c2c2c;
            }
            
            /* Labels */
            QLabel#TimeLabel {
                font-size: 72px;
                font-weight: 800;
                color: #ffffff;
                letter-spacing: 1px;
            }
            
            QLabel#DateLabel {
                font-size: 18px;
                color: #00d2ff;
                font-weight: 500;
            }
            
            QLabel#WorldClockName {
                font-size: 20px;
                font-weight: 700;
                color: #ffffff;
            }
            
            QLabel#WorldClockFullName {
                font-size: 11px;
                color: #888888;
            }
            
            QLabel#WorldClockOffset {
                font-size: 12px;
                color: #b3b3b3;
                font-weight: 500;
            }
            
            QLabel#WorldClockTime {
                font-size: 24px;
                font-weight: 700;
                color: #00d2ff;
            }
            
            QLabel#StopwatchTimeLabel {
                font-size: 64px;
                font-weight: 800;
                color: #ffffff;
                font-family: monospace;
            }
            
            QLabel#TimerTimeLabel {
                font-size: 64px;
                font-weight: 800;
                color: #ffffff;
                font-family: monospace;
            }
            
            /* Inputs (ComboBox, SpinBoxes) */
            QComboBox {
                background-color: #1e1e1e;
                border: 1px solid #2c2c2c;
                border-radius: 8px;
                padding: 8px 12px;
                color: #ffffff;
            }
            
            QComboBox::drop-down {
                border: none;
                width: 30px;
            }
            
            QComboBox QAbstractItemView {
                background-color: #1e1e1e;
                border: 1px solid #2c2c2c;
                selection-background-color: #0072ff;
                selection-color: #ffffff;
                color: #ffffff;
            }
            
            QSpinBox {
                background-color: #1e1e1e;
                border: 1px solid #2c2c2c;
                border-radius: 8px;
                padding: 8px 12px;
                color: #ffffff;
                font-size: 18px;
                font-weight: 600;
                min-width: 80px;
            }
            
            /* Buttons */
            QPushButton {
                background-color: #2a2a2a;
                color: #ffffff;
                border-radius: 8px;
                border: 1px solid #3c3c3c;
                font-weight: 600;
                padding: 6px 12px;
            }
            
            QPushButton:hover {
                background-color: #383838;
                border-color: #4e4e4e;
            }
            
            QPushButton:pressed {
                background-color: #1f1f1f;
            }
            
            QPushButton:disabled {
                background-color: #151515;
                color: #666666;
                border-color: #222222;
            }
            
            QPushButton#WorldClockAddBtn {
                background-color: #0072ff;
                border: none;
            }
            
            QPushButton#WorldClockAddBtn:hover {
                background-color: #005ecb;
            }
            
            QPushButton#WorldClockRemoveBtn {
                background-color: transparent;
                border: none;
                color: #888888;
                font-size: 20px;
                font-weight: bold;
            }
            
            QPushButton#WorldClockRemoveBtn:hover {
                color: #ff1744;
                background-color: #2e1d21;
                border-radius: 14px;
            }
            
            QPushButton#StopwatchStartBtn, QPushButton#TimerStartBtn {
                background-color: #00c853;
                border: none;
                color: #ffffff;
                font-size: 15px;
            }
            
            QPushButton#StopwatchStartBtn:hover, QPushButton#TimerStartBtn:hover {
                background-color: #2e7d32;
            }
            
            QPushButton#StopwatchPauseBtn, QPushButton#TimerPauseBtn {
                background-color: #ff9100;
                border: none;
                color: #ffffff;
                font-size: 15px;
            }
            
            QPushButton#StopwatchPauseBtn:hover, QPushButton#TimerPauseBtn:hover {
                background-color: #ef6c00;
            }
            
            QPushButton#StopwatchLapResetBtn, QPushButton#TimerResetBtn {
                background-color: #d50000;
                border: none;
                color: #ffffff;
                font-size: 15px;
            }
            
            QPushButton#StopwatchLapResetBtn:hover, QPushButton#TimerResetBtn:hover {
                background-color: #c62828;
            }
            
            QPushButton#TimerQuickBtn {
                background-color: #1e1e1e;
                color: #b3b3b3;
                border: 1px solid #2c2c2c;
                font-size: 12px;
                border-radius: 6px;
            }
            
            QPushButton#TimerQuickBtn:hover {
                background-color: #2a2a2a;
                color: #ffffff;
                border-color: #444444;
            }
            
            /* Table Widget Styling */
            QTableWidget {
                background-color: #121212;
                border: none;
                gridline-color: #222222;
            }
            
            QTableWidget::item {
                padding: 10px;
                border-bottom: 1px solid #1a1a1a;
                font-size: 15px;
            }
            
            QHeaderView::section {
                background-color: #1a1a1a;
                color: #888888;
                padding: 10px;
                border: none;
                font-weight: bold;
                font-size: 12px;
                text-transform: uppercase;
            }
            
            /* Progress Bar Styling */
            QProgressBar {
                background-color: #222222;
                border-radius: 4px;
                border: none;
            }
            
            QProgressBar::chunk {
                background: qlineargradient(x1:0, y1:0, x2:1, y2:0, stop:0 #0072ff, stop:1 #00d2ff);
                border-radius: 4px;
            }
            
            /* ScrollBar Styling */
            QScrollBar:vertical {
                border: none;
                background: #121212;
                width: 8px;
                margin: 0px;
            }
            
            QScrollBar::handle:vertical {
                background: #333333;
                min-height: 20px;
                border-radius: 4px;
            }
            
            QScrollBar::handle:vertical:hover {
                background: #444444;
            }
            
            QScrollBar::add-line:vertical, QScrollBar::sub-line:vertical {
                border: none;
                background: none;
            }
            
            /* Alarm Clock Specific Styles */
            QFrame#AlarmAddPanel {
                background-color: #1e1e1e;
                border: 1px solid #2c2c2c;
                border-radius: 12px;
            }
            
            QFrame#AlarmCard {
                border-radius: 12px;
            }
            
            QLabel#AlarmCardTime {
                font-size: 24px;
                font-weight: 700;
                color: #ffffff;
            }
            
            QLabel#AlarmCardDesc {
                font-size: 14px;
                color: #00d2ff;
                font-weight: 500;
            }
            
            QLabel#AlarmCardRepeat {
                font-size: 11px;
                color: #888888;
            }
            
            QPushButton#AlarmAddBtn {
                background-color: #0072ff;
                border: none;
                color: white;
                border-radius: 6px;
                font-weight: bold;
            }
            
            QPushButton#AlarmAddBtn:hover {
                background-color: #005ecb;
            }
            
            QPushButton#AlarmCardRemoveBtn {
                background-color: transparent;
                border: none;
                color: #888888;
                font-size: 20px;
                font-weight: bold;
            }
            
            QPushButton#AlarmCardRemoveBtn:hover {
                color: #ff1744;
                background-color: #2e1d21;
                border-radius: 14px;
            }
            
            QLineEdit#AlarmLabelEdit {
                background-color: #151515;
                border: 1px solid #2c2c2c;
                border-radius: 6px;
                padding: 6px 10px;
                color: #ffffff;
            }
            
            QTimeEdit#AlarmTimeEdit {
                background-color: #151515;
                border: 1px solid #2c2c2c;
                border-radius: 6px;
                padding: 6px 10px;
                color: #ffffff;
                font-size: 14px;
            }
            
            /* QCheckBox Style (toggle indicator look) */
            QCheckBox {
                spacing: 8px;
                color: #b3b3b3;
                font-weight: 500;
            }
            
            QCheckBox::indicator {
                width: 18px;
                height: 18px;
                border: 1px solid #3c3c3c;
                border-radius: 4px;
                background-color: #222222;
            }
            
            QCheckBox::indicator:checked {
                background-color: #00e676;
                border: none;
            }
            
            QCheckBox::indicator:hover {
                border-color: #555555;
            }
        """

def main():
    app = QApplication(sys.argv)
    
    # Set global application font
    font = QFont("Inter", 10)
    app.setFont(font)
    
    window = MainWindow()
    window.show()
    sys.exit(app.exec())

if __name__ == "__main__":
    main()
