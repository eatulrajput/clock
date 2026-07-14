import time
from PyQt6.QtWidgets import (QWidget, QVBoxLayout, QHBoxLayout, QLabel, 
                             QPushButton, QComboBox, QMessageBox, QFrame)
from PyQt6.QtCore import QTimer, Qt, QSettings, QRectF
from PyQt6.QtGui import QPainter, QPen, QColor
from utils.helpers import format_timer_time

class CircularProgress(QWidget):
    def __init__(self, parent=None):
        super().__init__(parent)
        self.value = 100.0  # percentage (0.0 to 100.0)
        self.theme_mode = "light"
        self.is_flashing = False
        self.setFixedSize(220, 220)
        
    def set_value(self, value: float):
        self.value = float(value)
        self.update()  # trigger paint event
        
    def set_theme(self, theme_mode: str):
        self.theme_mode = theme_mode
        self.update()
        
    def set_flashing(self, flashing: bool):
        self.is_flashing = flashing
        self.update()
        
    def paintEvent(self, event):
        painter = QPainter(self)
        painter.setRenderHint(QPainter.RenderHint.Antialiasing)
        
        width = self.width()
        height = self.height()
        pen_width = 8
        rect = QRectF(pen_width, pen_width, width - 2 * pen_width, height - 2 * pen_width)
        
        # 1. Draw track arc background
        track_color = QColor("#e2e8f0") if self.theme_mode == "light" else QColor("#1e293b")
        pen_track = QPen(track_color)
        pen_track.setWidth(pen_width)
        pen_track.setCapStyle(Qt.PenCapStyle.RoundCap)
        painter.setPen(pen_track)
        painter.drawArc(rect, 0, 360 * 16)
        
        # 2. Draw active countdown progress arc
        if self.is_flashing:
            progress_color = QColor("#ef4444")  # Alert red
        else:
            progress_color = QColor("#6366f1") if self.theme_mode == "light" else QColor("#818cf8")
            
        pen_progress = QPen(progress_color)
        pen_progress.setWidth(pen_width)
        pen_progress.setCapStyle(Qt.PenCapStyle.RoundCap)
        painter.setPen(pen_progress)
        
        # Arc start angle is 90 degrees (top center of the circle)
        start_angle = 90 * 16
        # Arc sweeps clockwise (- angle) matching progress percentage
        span_angle = int(-(self.value / 100.0) * 360 * 16)
        
        painter.drawArc(rect, start_angle, span_angle)
        painter.end()


class TimerTab(QWidget):
    def __init__(self, parent=None):
        super().__init__(parent)
        self.running = False
        self.initial_duration = 0.0      # Target duration in seconds
        self.remaining_time = 0.0         # Current remaining seconds
        self.end_time = 0.0               # Epoch timestamp when timer will hit 0
        self.flash_state = False          # Used for pulsing red when timer ends
        
        global_settings = QSettings("LinuxClockApp", "GlobalSettings")
        self.theme_mode = global_settings.value("theme_mode", "light")
        
        self.init_ui()
        
    def init_ui(self):
        # Layout with generous margins
        layout = QVBoxLayout(self)
        layout.setContentsMargins(24, 24, 24, 24)
        layout.setSpacing(20)
        
        # Display Box (Card)
        self.display_frame = QFrame(self)
        self.display_frame.setObjectName("TimerDisplayFrame")
        display_layout = QVBoxLayout(self.display_frame)
        display_layout.setContentsMargins(30, 30, 30, 30)
        display_layout.setSpacing(20)
        display_layout.setAlignment(Qt.AlignmentFlag.AlignCenter)
        
        # Circular Progress dial shell
        self.progress_dial = CircularProgress(self)
        self.progress_dial.set_theme(self.theme_mode)
        
        dial_layout = QVBoxLayout(self.progress_dial)
        dial_layout.setContentsMargins(15, 15, 15, 15)
        dial_layout.setSpacing(8)
        dial_layout.setAlignment(Qt.AlignmentFlag.AlignCenter)
        
        # Sub-title inside dial
        self.title_label = QLabel("⏳ TIMER", self.progress_dial)
        self.title_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        self.title_label.setStyleSheet("font-size: 11px; font-weight: 700; letter-spacing: 1.5px; background: transparent; border: none;")
        
        # Time counter digits inside dial
        self.time_label = QLabel("00:00:00", self.progress_dial)
        self.time_label.setObjectName("TimerTimeLabel")
        self.time_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        self.time_label.setStyleSheet("font-size: 26px; font-weight: 800; background: transparent; border: none;")
        
        dial_layout.addWidget(self.title_label)
        dial_layout.addWidget(self.time_label)
        
        display_layout.addWidget(self.progress_dial, alignment=Qt.AlignmentFlag.AlignCenter)
        layout.addWidget(self.display_frame)
        
        # Setup Inputs Container (Scrollable ComboBox Wheel-style pickers)
        self.input_widget = QWidget(self)
        input_layout = QHBoxLayout(self.input_widget)
        input_layout.setSpacing(15)
        input_layout.setAlignment(Qt.AlignmentFlag.AlignCenter)
        
        # Hours Combo
        self.hour_combo = QComboBox(self)
        self.hour_combo.setObjectName("TimerCombo")
        self.hour_combo.addItems([f"{i:02d}" for i in range(24)])
        self.hour_combo.setCurrentIndex(0)
        self.hour_combo.setFixedWidth(80)
        
        # Minutes Combo
        self.min_combo = QComboBox(self)
        self.min_combo.setObjectName("TimerCombo")
        self.min_combo.addItems([f"{i:02d}" for i in range(60)])
        self.min_combo.setCurrentIndex(5)
        self.min_combo.setFixedWidth(80)
        
        # Seconds Combo
        self.sec_combo = QComboBox(self)
        self.sec_combo.setObjectName("TimerCombo")
        self.sec_combo.addItems([f"{i:02d}" for i in range(60)])
        self.sec_combo.setCurrentIndex(0)
        self.sec_combo.setFixedWidth(80)
        
        input_layout.addWidget(QLabel("Hours:"))
        input_layout.addWidget(self.hour_combo)
        input_layout.addWidget(QLabel("Min:"))
        input_layout.addWidget(self.min_combo)
        input_layout.addWidget(QLabel("Sec:"))
        input_layout.addWidget(self.sec_combo)
        layout.addWidget(self.input_widget)
        
        # Quick Adjustment Buttons
        quick_layout = QHBoxLayout()
        quick_layout.setSpacing(10)
        quick_layout.setAlignment(Qt.AlignmentFlag.AlignCenter)
        
        adjustments = [
            ("⏮ -5m", -300),
            ("◀ -1m", -60),
            ("▶ +1m", 60),
            ("⏭ +5m", 300)
        ]
        self.adj_buttons = []
        for text, val in adjustments:
            btn = QPushButton(text, self)
            btn.setObjectName("TimerQuickBtn")
            btn.setFixedSize(70, 32)
            btn.clicked.connect(lambda checked, v=val: self.adjust_time(v))
            quick_layout.addWidget(btn)
            self.adj_buttons.append(btn)
            
        layout.addLayout(quick_layout)
        
        # Controls Row
        btn_layout = QHBoxLayout()
        btn_layout.setSpacing(20)
        btn_layout.setAlignment(Qt.AlignmentFlag.AlignCenter)
        
        self.reset_btn = QPushButton("🔄 Reset", self)
        self.reset_btn.setObjectName("TimerResetBtn")
        self.reset_btn.setFixedSize(140, 42)
        self.reset_btn.clicked.connect(self.handle_reset)
        self.reset_btn.setEnabled(False)
        
        self.start_pause_btn = QPushButton("▶ Start", self)
        self.start_pause_btn.setObjectName("TimerStartBtn")
        self.start_pause_btn.setFixedSize(140, 42)
        self.start_pause_btn.clicked.connect(self.handle_start_pause)
        
        btn_layout.addWidget(self.reset_btn)
        btn_layout.addWidget(self.start_pause_btn)
        layout.addLayout(btn_layout)
        
        # Update display initially
        self.sync_display_from_inputs()
        
        # Timers
        self.timer = QTimer(self)
        self.timer.timeout.connect(self.update_countdown)
        
        self.flash_timer = QTimer(self)
        self.flash_timer.timeout.connect(self.trigger_flash)
        
        # Connect combo index change signals to display updates when stopped
        self.hour_combo.currentIndexChanged.connect(self.sync_display_from_inputs)
        self.min_combo.currentIndexChanged.connect(self.sync_display_from_inputs)
        self.sec_combo.currentIndexChanged.connect(self.sync_display_from_inputs)
        
        # Connect theme labels color initial styles
        self.update_theme_styles(self.theme_mode)
        
    def sync_display_from_inputs(self):
        if not self.running and self.remaining_time <= 0:
            h = int(self.hour_combo.currentText())
            m = int(self.min_combo.currentText())
            s = int(self.sec_combo.currentText())
            total_secs = h * 3600 + m * 60 + s
            self.time_label.setText(format_timer_time(total_secs))
            
    def get_inputs_duration(self) -> float:
        h = int(self.hour_combo.currentText())
        m = int(self.min_combo.currentText())
        s = int(self.sec_combo.currentText())
        return float(h * 3600 + m * 60 + s)

    def adjust_time(self, delta_seconds: float):
        if self.running:
            new_end = self.end_time + delta_seconds
            now = time.time()
            if new_end < now:
                new_end = now
            self.end_time = new_end
            self.initial_duration = max(1.0, self.initial_duration + delta_seconds)
            self.update_countdown()
        else:
            if self.remaining_time > 0:
                self.remaining_time = max(0.0, self.remaining_time + delta_seconds)
                self.time_label.setText(format_timer_time(int(self.remaining_time)))
            else:
                total = int(self.get_inputs_duration() + delta_seconds)
                if total < 0:
                    total = 0
                
                h = total // 3600
                m = (total % 3600) // 60
                s = total % 60
                
                self.hour_combo.blockSignals(True)
                self.min_combo.blockSignals(True)
                self.sec_combo.blockSignals(True)
                
                self.hour_combo.setCurrentIndex(h % 24)
                self.min_combo.setCurrentIndex(m % 60)
                self.sec_combo.setCurrentIndex(s % 60)
                
                self.hour_combo.blockSignals(False)
                self.min_combo.blockSignals(False)
                self.sec_combo.blockSignals(False)
                
                self.sync_display_from_inputs()

    def handle_start_pause(self):
        if not self.running:
            if self.remaining_time <= 0:
                duration = self.get_inputs_duration()
                if duration <= 0:
                    return
                self.initial_duration = duration
                self.remaining_time = duration
                
            self.running = True
            self.end_time = time.time() + self.remaining_time
            self.timer.start(100)
            
            self.input_widget.setEnabled(False)
            
            self.start_pause_btn.setText("⏸ Pause")
            self.start_pause_btn.setObjectName("TimerPauseBtn")
            self.start_pause_btn.setStyleSheet("")
            self.reset_btn.setEnabled(True)
        else:
            self.running = False
            self.remaining_time = max(0.0, self.end_time - time.time())
            self.timer.stop()
            
            self.start_pause_btn.setText("▶ Resume")
            self.start_pause_btn.setObjectName("TimerStartBtn")
            self.start_pause_btn.setStyleSheet("")
            
        self.start_pause_btn.style().unpolish(self.start_pause_btn)
        self.start_pause_btn.style().polish(self.start_pause_btn)

    def handle_reset(self):
        self.running = False
        self.timer.stop()
        self.flash_timer.stop()
        self.remaining_time = 0.0
        self.initial_duration = 0.0
        
        self.display_frame.setStyleSheet("")
        self.input_widget.setEnabled(True)
        
        self.sync_display_from_inputs()
        self.progress_dial.set_value(100.0)
        self.progress_dial.set_flashing(False)
        
        self.start_pause_btn.setText("▶ Start")
        self.start_pause_btn.setObjectName("TimerStartBtn")
        self.start_pause_btn.setStyleSheet("")
        self.reset_btn.setEnabled(False)
        
        self.start_pause_btn.style().unpolish(self.start_pause_btn)
        self.start_pause_btn.style().polish(self.start_pause_btn)

    def update_countdown(self):
        now = time.time()
        remaining = self.end_time - now
        
        if remaining <= 0:
            self.running = False
            self.timer.stop()
            self.remaining_time = 0.0
            self.time_label.setText("00:00:00")
            self.progress_dial.set_value(0.0)
            
            self.trigger_alarm()
        else:
            self.remaining_time = remaining
            self.time_label.setText(format_timer_time(int(remaining)))
            percentage = (remaining / self.initial_duration) * 100.0
            self.progress_dial.set_value(percentage)

    def trigger_alarm(self):
        self.flash_state = True
        self.flash_timer.start(500)
        self.trigger_flash()
        
        print("\a", end="", flush=True)
        
        msg = QMessageBox(self)
        msg.setWindowTitle("Timer Finished")
        msg.setText("Time's up!")
        msg.setIcon(QMessageBox.Icon.Information)
        msg.setStandardButtons(QMessageBox.StandardButton.Ok)
        
        msg.finished.connect(self.stop_alarm)
        msg.exec()

    def trigger_flash(self):
        if self.flash_state:
            self.progress_dial.set_flashing(True)
            self.display_frame.setStyleSheet("QFrame#TimerDisplayFrame { background-color: #450a0a; border: 2px solid #ef4444; }")
        else:
            self.progress_dial.set_flashing(False)
            if self.theme_mode == "light":
                self.display_frame.setStyleSheet("QFrame#TimerDisplayFrame { background-color: #ffffff; border: 1px solid #cbd5e1; }")
            else:
                self.display_frame.setStyleSheet("QFrame#TimerDisplayFrame { background-color: #131927; border: 1px solid #1e293b; }")
        self.flash_state = not self.flash_state

    def stop_alarm(self):
        self.flash_timer.stop()
        self.handle_reset()

    def update_theme_styles(self, theme_mode: str):
        self.theme_mode = theme_mode
        self.progress_dial.set_theme(theme_mode)
        if theme_mode == "light":
            self.title_label.setStyleSheet("color: #4f46e5; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; background: transparent; border: none;")
        else:
            self.title_label.setStyleSheet("color: #818cf8; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; background: transparent; border: none;")
            
        self.time_label.style().unpolish(self.time_label)
        self.time_label.style().polish(self.time_label)
