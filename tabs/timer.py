import time
from PyQt6.QtWidgets import (QWidget, QVBoxLayout, QHBoxLayout, QLabel, 
                             QPushButton, QSpinBox, QProgressBar, QMessageBox, QFrame)
from PyQt6.QtCore import QTimer, Qt
from utils.helpers import format_timer_time

class TimerTab(QWidget):
    def __init__(self, parent=None):
        super().__init__(parent)
        self.running = False
        self.initial_duration = 0.0      # Target duration in seconds
        self.remaining_time = 0.0         # Current remaining seconds
        self.end_time = 0.0               # Epoch timestamp when timer will hit 0
        self.flash_state = False          # Used for pulsing red when timer ends
        
        self.init_ui()
        
    def init_ui(self):
        # Layout
        layout = QVBoxLayout(self)
        layout.setContentsMargins(20, 20, 20, 20)
        layout.setSpacing(20)
        
        # Display Box
        self.display_frame = QFrame(self)
        self.display_frame.setObjectName("TimerDisplayFrame")
        display_layout = QVBoxLayout(self.display_frame)
        display_layout.setContentsMargins(20, 20, 20, 20)
        display_layout.setSpacing(10)
        
        self.time_label = QLabel("00:00:00", self)
        self.time_label.setObjectName("TimerTimeLabel")
        self.time_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        display_layout.addWidget(self.time_label)
        
        # Progress Bar
        self.progress_bar = QProgressBar(self)
        self.progress_bar.setObjectName("TimerProgressBar")
        self.progress_bar.setValue(100)
        self.progress_bar.setTextVisible(False)
        self.progress_bar.setFixedHeight(8)
        display_layout.addWidget(self.progress_bar)
        
        layout.addWidget(self.display_frame)
        
        # Setup Inputs Container (Hours, Minutes, Seconds)
        self.input_widget = QWidget(self)
        input_layout = QHBoxLayout(self.input_widget)
        input_layout.setSpacing(15)
        input_layout.setAlignment(Qt.AlignmentFlag.AlignCenter)
        
        # Hours
        self.hour_spin = QSpinBox(self)
        self.hour_spin.setRange(0, 23)
        self.hour_spin.setSuffix(" h")
        self.hour_spin.setObjectName("TimerSpinBox")
        
        # Minutes
        self.min_spin = QSpinBox(self)
        self.min_spin.setRange(0, 59)
        self.min_spin.setSuffix(" m")
        self.min_spin.setValue(5)  # Default 5 minutes
        self.min_spin.setObjectName("TimerSpinBox")
        
        # Seconds
        self.sec_spin = QSpinBox(self)
        self.sec_spin.setRange(0, 59)
        self.sec_spin.setSuffix(" s")
        self.sec_spin.setObjectName("TimerSpinBox")
        
        input_layout.addWidget(self.hour_spin)
        input_layout.addWidget(self.min_spin)
        input_layout.addWidget(self.sec_spin)
        layout.addWidget(self.input_widget)
        
        # Quick Adjustment Buttons (+1 Min, -1 Min, +5 Min, -5 Min)
        quick_layout = QHBoxLayout()
        quick_layout.setSpacing(10)
        quick_layout.setAlignment(Qt.AlignmentFlag.AlignCenter)
        
        adjustments = [
            ("-5 Min", -300),
            ("-1 Min", -60),
            ("+1 Min", 60),
            ("+5 Min", 300)
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
        
        self.reset_btn = QPushButton("Reset", self)
        self.reset_btn.setObjectName("TimerResetBtn")
        self.reset_btn.setFixedSize(120, 45)
        self.reset_btn.clicked.connect(self.handle_reset)
        self.reset_btn.setEnabled(False)
        
        self.start_pause_btn = QPushButton("Start", self)
        self.start_pause_btn.setObjectName("TimerStartBtn")
        self.start_pause_btn.setFixedSize(120, 45)
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
        
        # Connect spin box changes to display updates when stopped
        self.hour_spin.valueChanged.connect(self.sync_display_from_inputs)
        self.min_spin.valueChanged.connect(self.sync_display_from_inputs)
        self.sec_spin.valueChanged.connect(self.sync_display_from_inputs)
        
    def sync_display_from_inputs(self):
        if not self.running and self.remaining_time <= 0:
            h = self.hour_spin.value()
            m = self.min_spin.value()
            s = self.sec_spin.value()
            total_secs = h * 3600 + m * 60 + s
            self.time_label.setText(format_timer_time(total_secs))
            
    def get_inputs_duration(self) -> float:
        h = self.hour_spin.value()
        m = self.min_spin.value()
        s = self.sec_spin.value()
        return float(h * 3600 + m * 60 + s)

    def adjust_time(self, delta_seconds: float):
        """Adjusts the timer time dynamically, respecting boundary limits."""
        if self.running:
            # Adjust the end time
            new_end = self.end_time + delta_seconds
            # Safety limit: do not let it drop below current time (0 seconds remaining)
            now = time.time()
            if new_end < now:
                new_end = now
            self.end_time = new_end
            
            # Recalculate original duration so progress bar makes sense
            self.initial_duration = max(1.0, self.initial_duration + delta_seconds)
            self.update_countdown()
        else:
            # Adjust remaining_time directly or modify spin boxes
            if self.remaining_time > 0:
                self.remaining_time = max(0.0, self.remaining_time + delta_seconds)
                self.time_label.setText(format_timer_time(int(self.remaining_time)))
            else:
                # Adjust spin boxes
                total = int(self.get_inputs_duration() + delta_seconds)
                if total < 0:
                    total = 0
                
                h = total // 3600
                m = (total % 3600) // 60
                s = total % 60
                
                # Temporarily block signals to avoid multiple calls
                self.hour_spin.blockSignals(True)
                self.min_spin.blockSignals(True)
                self.sec_spin.blockSignals(True)
                
                self.hour_spin.setValue(h)
                self.min_spin.setValue(m)
                self.sec_spin.setValue(s)
                
                self.hour_spin.blockSignals(False)
                self.min_spin.blockSignals(False)
                self.sec_spin.blockSignals(False)
                
                self.sync_display_from_inputs()

    def handle_start_pause(self):
        if not self.running:
            # Check if duration is 0
            if self.remaining_time <= 0:
                duration = self.get_inputs_duration()
                if duration <= 0:
                    return  # Can't start a 0-second timer
                self.initial_duration = duration
                self.remaining_time = duration
                
            self.running = True
            self.end_time = time.time() + self.remaining_time
            self.timer.start(100)
            
            # Disable inputs
            self.input_widget.setEnabled(False)
            
            # Update buttons
            self.start_pause_btn.setText("Pause")
            self.start_pause_btn.setObjectName("TimerPauseBtn")
            self.start_pause_btn.setStyleSheet("")
            self.reset_btn.setEnabled(True)
        else:
            # Pause
            self.running = False
            self.remaining_time = max(0.0, self.end_time - time.time())
            self.timer.stop()
            
            # Update buttons
            self.start_pause_btn.setText("Resume")
            self.start_pause_btn.setObjectName("TimerStartBtn")
            self.start_pause_btn.setStyleSheet("")
            
        # Re-apply style to reflect objectName changes
        self.start_pause_btn.style().unpolish(self.start_pause_btn)
        self.start_pause_btn.style().polish(self.start_pause_btn)

    def handle_reset(self):
        self.running = False
        self.timer.stop()
        self.flash_timer.stop()
        self.remaining_time = 0.0
        self.initial_duration = 0.0
        
        # Reset display style
        self.display_frame.setStyleSheet("")
        
        # Enable inputs
        self.input_widget.setEnabled(True)
        
        # Sync inputs & progress
        self.sync_display_from_inputs()
        self.progress_bar.setValue(100)
        
        # Update buttons
        self.start_pause_btn.setText("Start")
        self.start_pause_btn.setObjectName("TimerStartBtn")
        self.start_pause_btn.setStyleSheet("")
        self.reset_btn.setEnabled(False)
        
        # Re-apply style to reflect objectName changes
        self.start_pause_btn.style().unpolish(self.start_pause_btn)
        self.start_pause_btn.style().polish(self.start_pause_btn)

    def update_countdown(self):
        now = time.time()
        remaining = self.end_time - now
        
        if remaining <= 0:
            # Timer finished!
            self.running = False
            self.timer.stop()
            self.remaining_time = 0.0
            self.time_label.setText("00:00:00")
            self.progress_bar.setValue(0)
            
            # Trigger Alarm
            self.trigger_alarm()
        else:
            self.remaining_time = remaining
            self.time_label.setText(format_timer_time(int(remaining)))
            # Compute percentage
            percentage = int((remaining / self.initial_duration) * 100)
            self.progress_bar.setValue(percentage)

    def trigger_alarm(self):
        # Start screen flashing
        self.flash_state = True
        self.flash_timer.start(500)
        self.trigger_flash()
        
        # Play standard terminal bell sound (beep)
        print("\a", end="", flush=True)
        
        # Display Message box
        msg = QMessageBox(self)
        msg.setWindowTitle("Timer Finished")
        msg.setText("Time's up!")
        msg.setIcon(QMessageBox.Icon.Information)
        msg.setStandardButtons(QMessageBox.StandardButton.Ok)
        
        # Stop flashing when user clicks OK
        msg.finished.connect(self.stop_alarm)
        msg.exec()

    def trigger_flash(self):
        if self.flash_state:
            self.display_frame.setStyleSheet("QFrame#TimerDisplayFrame { background-color: #55171e; border: 2px solid #ff1744; }")
        else:
            self.display_frame.setStyleSheet("QFrame#TimerDisplayFrame { background-color: #1e1e1e; border: none; }")
        self.flash_state = not self.flash_state

    def stop_alarm(self):
        self.flash_timer.stop()
        self.handle_reset()
