import sys
from PyQt6.QtWidgets import QApplication, QMainWindow, QTabWidget, QWidget, QVBoxLayout
from PyQt6.QtGui import QFont
from PyQt6.QtCore import Qt, QSettings

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
        
        # Theme initialization
        self.settings = QSettings("LinuxClockApp", "GlobalSettings")
        self.theme_mode = self.settings.value("theme_mode", "light") # default to light theme to match reference image
        
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

        # Apply global theme stylesheet
        self.setStyleSheet(self.get_stylesheet(self.theme_mode))

    def set_theme(self, theme_mode: str):
        self.theme_mode = theme_mode
        self.settings.setValue("theme_mode", theme_mode)
        self.setStyleSheet(self.get_stylesheet(theme_mode))
        
        # Propagate theme to all tabs
        for tab in [self.local_clock_tab, self.world_clock_tab, self.alarm_clock_tab, self.stopwatch_tab, self.timer_tab]:
            if hasattr(tab, "update_theme_styles"):
                tab.update_theme_styles(theme_mode)

    def get_stylesheet(self, theme_mode: str) -> str:
        if theme_mode == "light":
            return """
                /* Global Light Theme Styles */
                QWidget {
                    background-color: #f3f4f6;
                    color: #0f172a;
                    font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
                    font-size: 14px;
                }
                
                /* Tab Widget Styling */
                QTabWidget::pane {
                    border: none;
                    background-color: #f3f4f6;
                }
                
                QTabBar {
                    background-color: transparent;
                    qproperty-drawBase: 0;
                }
                
                QTabBar::tab {
                    background-color: transparent;
                    color: #475569;
                    padding: 10px 16px;
                    margin: 4px;
                    border-radius: 8px;
                    font-weight: 600;
                    font-size: 13px;
                }
                
                QTabBar::tab:hover {
                    color: #0f172a;
                    background-color: #e2e8f0;
                }
                
                QTabBar::tab:selected {
                    color: #6366f1;
                    background-color: #ffffff;
                    border: 1px solid #cbd5e1;
                }
                
                /* QFrame Containers (Cards) */
                QFrame#ClockCard {
                    background-color: #ffffff;
                    border: 1px solid #cbd5e1;
                    border-radius: 16px;
                }
                
                QFrame#WorldClockCard {
                    background-color: #ffffff;
                    border: 1px solid #cbd5e1;
                    border-radius: 12px;
                }
                
                QFrame#TimerDisplayFrame {
                    background-color: #ffffff;
                    border-radius: 16px;
                    border: 1px solid #cbd5e1;
                }
                
                /* Labels */
                QLabel#TimeLabel {
                    font-size: 80px;
                    font-weight: 800;
                    color: #000000;
                    letter-spacing: -2px;
                }
                
                QLabel#DateLabel {
                    font-size: 14px;
                    color: #6366f1;
                    font-weight: 700;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                }
                
                QLabel#StopwatchTimeLabel {
                    font-size: 68px;
                    font-weight: 800;
                    color: #000000;
                    font-family: "SF Mono", Consolas, "Fira Code", "Liberation Mono", Menlo, Monaco, monospace;
                    letter-spacing: -1px;
                }
                
                QLabel#TimerTimeLabel {
                    font-size: 68px;
                    font-weight: 800;
                    color: #000000;
                    font-family: "SF Mono", Consolas, "Fira Code", "Liberation Mono", Menlo, Monaco, monospace;
                    letter-spacing: -1px;
                }
                
                /* Inputs */
                QComboBox {
                    background-color: #ffffff;
                    border: 1px solid #cbd5e1;
                    border-radius: 8px;
                    padding: 8px 12px;
                    color: #0f172a;
                }
                
                QComboBox:focus {
                    border-color: #6366f1;
                }
                
                QComboBox::drop-down {
                    border: none;
                    width: 30px;
                }
                
                QComboBox QAbstractItemView {
                    background-color: #ffffff;
                    border: 1px solid #cbd5e1;
                    selection-background-color: #6366f1;
                    selection-color: #ffffff;
                    color: #0f172a;
                }
                
                QSpinBox {
                    background-color: #ffffff;
                    border: 1px solid #cbd5e1;
                    border-radius: 8px;
                    padding: 8px 12px;
                    color: #0f172a;
                    font-size: 18px;
                    font-weight: 600;
                    min-width: 85px;
                }
                
                QSpinBox:focus {
                    border-color: #6366f1;
                }
                
                /* Buttons */
                QPushButton {
                    background-color: #ffffff;
                    color: #0f172a;
                    border-radius: 8px;
                    border: 1px solid #cbd5e1;
                    font-weight: 600;
                    padding: 8px 16px;
                    font-size: 13px;
                }
                
                QPushButton:hover {
                    background-color: #f1f5f9;
                    border-color: #cbd5e1;
                }
                
                QPushButton:pressed {
                    background-color: #e2e8f0;
                }
                
                QPushButton:disabled {
                    background-color: #e2e8f0;
                    color: #94a3b8;
                    border-color: #cbd5e1;
                }
                
                QPushButton#StopwatchStartBtn, QPushButton#TimerStartBtn {
                    background-color: #10b981;
                    border: none;
                    color: #ffffff;
                    font-size: 14px;
                }
                
                QPushButton#StopwatchStartBtn:hover, QPushButton#TimerStartBtn:hover {
                    background-color: #059669;
                }
                
                QPushButton#StopwatchPauseBtn, QPushButton#TimerPauseBtn {
                    background-color: #f59e0b;
                    border: none;
                    color: #ffffff;
                    font-size: 14px;
                }
                
                QPushButton#StopwatchPauseBtn:hover, QPushButton#TimerPauseBtn:hover {
                    background-color: #d97706;
                }
                
                QPushButton#StopwatchLapResetBtn, QPushButton#TimerResetBtn {
                    background-color: #ef4444;
                    border: none;
                    color: #ffffff;
                    font-size: 14px;
                }
                
                QPushButton#StopwatchLapResetBtn:hover, QPushButton#TimerResetBtn:hover {
                    background-color: #dc2626;
                }
                
                QPushButton#TimerQuickBtn {
                    background-color: #ffffff;
                    color: #475569;
                    border: 1px solid #cbd5e1;
                    font-size: 12px;
                    border-radius: 6px;
                }
                
                QPushButton#TimerQuickBtn:hover {
                    background-color: #f1f5f9;
                    color: #0f172a;
                    border-color: #94a3b8;
                }
                
                /* Table Widget Styling */
                QTableWidget {
                    background-color: #f3f4f6;
                    border: none;
                    gridline-color: #cbd5e1;
                }
                
                QTableWidget::item {
                    padding: 12px;
                    border-bottom: 1px solid #cbd5e1;
                    font-size: 14px;
                    color: #0f172a;
                }
                
                QHeaderView::section {
                    background-color: #cbd5e1;
                    color: #475569;
                    padding: 10px;
                    border: none;
                    font-weight: bold;
                    font-size: 11px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                
                /* Progress Bar Styling */
                QProgressBar {
                    background-color: #cbd5e1;
                    border-radius: 6px;
                    border: none;
                }
                
                QProgressBar::chunk {
                    background: qlineargradient(x1:0, y1:0, x2:1, y2:0, stop:0 #6366f1, stop:1 #38bdf8);
                    border-radius: 6px;
                }
                
                /* ScrollBar Styling */
                QScrollBar:vertical {
                    border: none;
                    background: #f3f4f6;
                    width: 6px;
                    margin: 0px;
                }
                
                QScrollBar::handle:vertical {
                    background: #cbd5e1;
                    min-height: 20px;
                    border-radius: 3px;
                }
                
                QScrollBar::handle:vertical:hover {
                    background: #94a3b8;
                }
                
                QScrollBar::add-line:vertical, QScrollBar::sub-line:vertical {
                    border: none;
                    background: none;
                }
                
                /* Alarm Clock Specific Styles */
                QFrame#AlarmAddPanel {
                    background-color: #ffffff;
                    border: 1px solid #cbd5e1;
                    border-radius: 12px;
                }
                
                QFrame#AlarmCard {
                    border-radius: 12px;
                }
                
                QLabel#AlarmCardTime {
                    font-size: 24px;
                    font-weight: 700;
                    color: #0f172a;
                }
                
                QLabel#AlarmCardDesc {
                    font-size: 14px;
                    color: #6366f1;
                    font-weight: 600;
                }
                
                QLabel#AlarmCardRepeat {
                    font-size: 11px;
                    color: #475569;
                    font-weight: 500;
                }
                
                QPushButton#AlarmAddBtn {
                    background-color: #6366f1;
                    border: none;
                    color: white;
                    border-radius: 8px;
                    font-weight: 600;
                }
                
                QPushButton#AlarmAddBtn:hover {
                    background-color: #4f46e5;
                }
                
                QPushButton#AlarmCardRemoveBtn {
                    background-color: transparent;
                    border: none;
                    color: #94a3b8;
                    font-size: 18px;
                    font-weight: bold;
                }
                
                QPushButton#AlarmCardRemoveBtn:hover {
                    color: #ef4444;
                    background-color: #fee2e2;
                    border-radius: 14px;
                }
                
                QLineEdit#AlarmLabelEdit {
                    background-color: #ffffff;
                    border: 1px solid #cbd5e1;
                    border-radius: 8px;
                    padding: 8px 12px;
                    color: #0f172a;
                }
                
                QLineEdit#AlarmLabelEdit:focus {
                    border-color: #6366f1;
                }
                
                QTimeEdit#AlarmTimeEdit {
                    background-color: #ffffff;
                    border: 1px solid #cbd5e1;
                    border-radius: 8px;
                    padding: 8px 12px;
                    color: #0f172a;
                    font-size: 14px;
                }
                
                QTimeEdit#AlarmTimeEdit:focus {
                    border-color: #6366f1;
                }
                
                /* QCheckBox Style (toggle indicator look) */
                QCheckBox {
                    spacing: 8px;
                    color: #475569;
                    font-weight: 500;
                }
                
                QCheckBox::indicator {
                    width: 18px;
                    height: 18px;
                    border: 1.5px solid #cbd5e1;
                    border-radius: 6px;
                    background-color: #ffffff;
                }
                
                QCheckBox::indicator:checked {
                    background-color: #10b981;
                    border-color: #10b981;
                }
                
                QCheckBox::indicator:hover {
                    border-color: #94a3b8;
                }
            """
        else:
            return """
                /* Global Dark Theme Styles */
                QWidget {
                    background-color: #0b0f19;
                    color: #f8fafc;
                    font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
                    font-size: 14px;
                }
                
                /* Tab Widget Styling */
                QTabWidget::pane {
                    border: none;
                    background-color: #0b0f19;
                }
                
                QTabBar {
                    background-color: transparent;
                    qproperty-drawBase: 0;
                }
                
                QTabBar::tab {
                    background-color: transparent;
                    color: #94a3b8;
                    padding: 10px 16px;
                    margin: 4px;
                    border-radius: 8px;
                    font-weight: 600;
                    font-size: 13px;
                }
                
                QTabBar::tab:hover {
                    color: #f8fafc;
                    background-color: #131927;
                }
                
                QTabBar::tab:selected {
                    color: #818cf8;
                    background-color: #1e293b;
                    border: 1px solid #312e81;
                }
                
                /* QFrame Containers (Cards) */
                QFrame#ClockCard {
                    background-color: #131927;
                    border: 1px solid #1e293b;
                    border-radius: 16px;
                }
                
                QFrame#WorldClockCard {
                    background-color: #131927;
                    border: 1px solid #1e293b;
                    border-radius: 12px;
                }
                
                QFrame#TimerDisplayFrame {
                    background-color: #131927;
                    border-radius: 16px;
                    border: 1px solid #1e293b;
                }
                
                /* Labels */
                QLabel#TimeLabel {
                    font-size: 80px;
                    font-weight: 800;
                    color: #f8fafc;
                    letter-spacing: -2px;
                }
                
                QLabel#DateLabel {
                    font-size: 14px;
                    color: #818cf8;
                    font-weight: 700;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                }
                
                QLabel#StopwatchTimeLabel {
                    font-size: 68px;
                    font-weight: 800;
                    color: #f8fafc;
                    font-family: "SF Mono", Consolas, "Fira Code", "Liberation Mono", Menlo, Monaco, monospace;
                    letter-spacing: -1px;
                }
                
                QLabel#TimerTimeLabel {
                    font-size: 68px;
                    font-weight: 800;
                    color: #f8fafc;
                    font-family: "SF Mono", Consolas, "Fira Code", "Liberation Mono", Menlo, Monaco, monospace;
                    letter-spacing: -1px;
                }
                
                /* Inputs */
                QComboBox {
                    background-color: #131927;
                    border: 1px solid #1e293b;
                    border-radius: 8px;
                    padding: 8px 12px;
                    color: #f8fafc;
                }
                
                QComboBox:focus {
                    border-color: #6366f1;
                }
                
                QComboBox::drop-down {
                    border: none;
                    width: 30px;
                }
                
                QComboBox QAbstractItemView {
                    background-color: #131927;
                    border: 1px solid #1e293b;
                    selection-background-color: #312e81;
                    selection-color: #ffffff;
                    color: #f8fafc;
                }
                
                QSpinBox {
                    background-color: #131927;
                    border: 1px solid #1e293b;
                    border-radius: 8px;
                    padding: 8px 12px;
                    color: #f8fafc;
                    font-size: 18px;
                    font-weight: 600;
                    min-width: 85px;
                }
                
                QSpinBox:focus {
                    border-color: #6366f1;
                }
                
                /* Buttons */
                QPushButton {
                    background-color: #1e293b;
                    color: #f8fafc;
                    border-radius: 8px;
                    border: 1px solid #334155;
                    font-weight: 600;
                    padding: 8px 16px;
                    font-size: 13px;
                }
                
                QPushButton:hover {
                    background-color: #334155;
                    border-color: #475569;
                }
                
                QPushButton:pressed {
                    background-color: #0f172a;
                }
                
                QPushButton:disabled {
                    background-color: #0b0f19;
                    color: #475569;
                    border-color: #1e293b;
                }
                
                QPushButton#StopwatchStartBtn, QPushButton#TimerStartBtn {
                    background-color: #10b981;
                    border: none;
                    color: #ffffff;
                    font-size: 14px;
                }
                
                QPushButton#StopwatchStartBtn:hover, QPushButton#TimerStartBtn:hover {
                    background-color: #059669;
                }
                
                QPushButton#StopwatchPauseBtn, QPushButton#TimerPauseBtn {
                    background-color: #f59e0b;
                    border: none;
                    color: #ffffff;
                    font-size: 14px;
                }
                
                QPushButton#StopwatchPauseBtn:hover, QPushButton#TimerPauseBtn:hover {
                    background-color: #d97706;
                }
                
                QPushButton#StopwatchLapResetBtn, QPushButton#TimerResetBtn {
                    background-color: #ef4444;
                    border: none;
                    color: #ffffff;
                    font-size: 14px;
                }
                
                QPushButton#StopwatchLapResetBtn:hover, QPushButton#TimerResetBtn:hover {
                    background-color: #dc2626;
                }
                
                QPushButton#TimerQuickBtn {
                    background-color: #131927;
                    color: #94a3b8;
                    border: 1px solid #1e293b;
                    font-size: 12px;
                    border-radius: 6px;
                }
                
                QPushButton#TimerQuickBtn:hover {
                    background-color: #1e293b;
                    color: #f8fafc;
                    border-color: #334155;
                }
                
                /* Table Widget Styling */
                QTableWidget {
                    background-color: #0b0f19;
                    border: none;
                    gridline-color: #131927;
                }
                
                QTableWidget::item {
                    padding: 12px;
                    border-bottom: 1px solid #131927;
                    font-size: 14px;
                    color: #f8fafc;
                }
                
                QHeaderView::section {
                    background-color: #131927;
                    color: #64748b;
                    padding: 10px;
                    border: none;
                    font-weight: bold;
                    font-size: 11px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                
                /* Progress Bar Styling */
                QProgressBar {
                    background-color: #131927;
                    border-radius: 6px;
                    border: none;
                }
                
                QProgressBar::chunk {
                    background: qlineargradient(x1:0, y1:0, x2:1, y2:0, stop:0 #6366f1, stop:1 #38bdf8);
                    border-radius: 6px;
                }
                
                /* ScrollBar Styling */
                QScrollBar:vertical {
                    border: none;
                    background: #0b0f19;
                    width: 6px;
                    margin: 0px;
                }
                
                QScrollBar::handle:vertical {
                    background: #222f47;
                    min-height: 20px;
                    border-radius: 3px;
                }
                
                QScrollBar::handle:vertical:hover {
                    background: #334155;
                }
                
                QScrollBar::add-line:vertical, QScrollBar::sub-line:vertical {
                    border: none;
                    background: none;
                }
                
                /* Alarm Clock Specific Styles */
                QFrame#AlarmAddPanel {
                    background-color: #131927;
                    border: 1px solid #1e293b;
                    border-radius: 12px;
                }
                
                QFrame#AlarmCard {
                    border-radius: 12px;
                }
                
                QLabel#AlarmCardTime {
                    font-size: 24px;
                    font-weight: 700;
                    color: #f8fafc;
                }
                
                QLabel#AlarmCardDesc {
                    font-size: 14px;
                    color: #818cf8;
                    font-weight: 600;
                }
                
                QLabel#AlarmCardRepeat {
                    font-size: 11px;
                    color: #64748b;
                    font-weight: 500;
                }
                
                QPushButton#AlarmAddBtn {
                    background-color: #6366f1;
                    border: none;
                    color: white;
                    border-radius: 8px;
                    font-weight: 600;
                }
                
                QPushButton#AlarmAddBtn:hover {
                    background-color: #4f46e5;
                }
                
                QPushButton#AlarmCardRemoveBtn {
                    background-color: transparent;
                    border: none;
                    color: #64748b;
                    font-size: 18px;
                    font-weight: bold;
                }
                
                QPushButton#AlarmCardRemoveBtn:hover {
                    color: #f87171;
                    background-color: #2d1a22;
                    border-radius: 14px;
                }
                
                QLineEdit#AlarmLabelEdit {
                    background-color: #0b0f19;
                    border: 1px solid #1e293b;
                    border-radius: 8px;
                    padding: 8px 12px;
                    color: #f8fafc;
                }
                
                QLineEdit#AlarmLabelEdit:focus {
                    border-color: #6366f1;
                }
                
                QTimeEdit#AlarmTimeEdit {
                    background-color: #0b0f19;
                    border: 1px solid #1e293b;
                    border-radius: 8px;
                    padding: 8px 12px;
                    color: #f8fafc;
                    font-size: 14px;
                }
                
                QTimeEdit#AlarmTimeEdit:focus {
                    border-color: #6366f1;
                }
                
                /* QCheckBox Style (toggle indicator look) */
                QCheckBox {
                    spacing: 8px;
                    color: #94a3b8;
                    font-weight: 500;
                }
                
                QCheckBox::indicator {
                    width: 18px;
                    height: 18px;
                    border: 1.5px solid #222f47;
                    border-radius: 6px;
                    background-color: #0b0f19;
                }
                
                QCheckBox::indicator:checked {
                    background-color: #10b981;
                    border-color: #10b981;
                }
                
                QCheckBox::indicator:hover {
                    border-color: #475569;
                }
            """

def main():
    app = QApplication(sys.argv)
    
    font = QFont("sans-serif", 10)
    app.setFont(font)
    
    window = MainWindow()
    window.show()
    sys.exit(app.exec())

if __name__ == "__main__":
    main()
