import time
from PyQt6.QtWidgets import (QWidget, QVBoxLayout, QHBoxLayout, QLabel, 
                             QPushButton, QTableWidget, QTableWidgetItem, QHeaderView)
from PyQt6.QtCore import QTimer, Qt
from utils.helpers import format_stopwatch_time

class StopwatchTab(QWidget):
    def __init__(self, parent=None):
        super().__init__(parent)
        self.running = False
        self.start_time = 0.0
        self.elapsed_before_pause = 0.0
        self.lap_times = []  # Stores (lap_number, lap_time, overall_time)
        
        self.init_ui()
        
    def init_ui(self):
        # Layout
        layout = QVBoxLayout(self)
        layout.setContentsMargins(20, 20, 20, 20)
        layout.setSpacing(20)
        
        # Display
        self.time_label = QLabel("00:00:00.000", self)
        self.time_label.setObjectName("StopwatchTimeLabel")
        self.time_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        layout.addWidget(self.time_label)
        
        # Controls Row
        btn_layout = QHBoxLayout()
        btn_layout.setSpacing(20)
        btn_layout.setAlignment(Qt.AlignmentFlag.AlignCenter)
        
        # Left button: Lap / Reset
        self.lap_reset_btn = QPushButton("Reset", self)
        self.lap_reset_btn.setObjectName("StopwatchLapResetBtn")
        self.lap_reset_btn.setFixedSize(120, 45)
        self.lap_reset_btn.clicked.connect(self.handle_lap_reset)
        self.lap_reset_btn.setEnabled(False)  # Disabled initially
        
        # Right button: Start / Pause
        self.start_pause_btn = QPushButton("Start", self)
        self.start_pause_btn.setObjectName("StopwatchStartBtn")  # styled via QSS
        self.start_pause_btn.setFixedSize(120, 45)
        self.start_pause_btn.clicked.connect(self.handle_start_pause)
        
        btn_layout.addWidget(self.lap_reset_btn)
        btn_layout.addWidget(self.start_pause_btn)
        layout.addLayout(btn_layout)
        
        # Lap Table
        self.lap_table = QTableWidget(self)
        self.lap_table.setObjectName("StopwatchLapTable")
        self.lap_table.setColumnCount(3)
        self.lap_table.setHorizontalHeaderLabels(["Lap", "Lap Time", "Total Time"])
        self.lap_table.horizontalHeader().setSectionResizeMode(QHeaderView.ResizeMode.Stretch)
        self.lap_table.verticalHeader().setVisible(False)
        self.lap_table.setEditTriggers(QTableWidget.EditTrigger.NoEditTriggers)
        self.lap_table.setSelectionMode(QTableWidget.SelectionMode.NoSelection)
        self.lap_table.setFocusPolicy(Qt.FocusPolicy.NoFocus)
        layout.addWidget(self.lap_table)
        
        # Update Timer (approx. 33fps -> ~30ms update rate for fluid millisecond visual changes)
        self.timer = QTimer(self)
        self.timer.timeout.connect(self.update_display)
        
    def get_current_elapsed(self) -> float:
        if self.running:
            return self.elapsed_before_pause + (time.time() - self.start_time)
        return self.elapsed_before_pause

    def update_display(self):
        elapsed = self.get_current_elapsed()
        self.time_label.setText(format_stopwatch_time(elapsed))

    def handle_start_pause(self):
        if not self.running:
            # Start
            self.running = True
            self.start_time = time.time()
            self.timer.start(30)
            
            # Update buttons
            self.start_pause_btn.setText("Pause")
            self.start_pause_btn.setObjectName("StopwatchPauseBtn")  # Trigger stylesheet change
            self.start_pause_btn.setStyleSheet("")  # Clear inline to re-apply QSS
            
            self.lap_reset_btn.setText("Lap")
            self.lap_reset_btn.setEnabled(True)
        else:
            # Pause
            self.running = False
            self.elapsed_before_pause += time.time() - self.start_time
            self.timer.stop()
            self.update_display()
            
            # Update buttons
            self.start_pause_btn.setText("Resume")
            self.start_pause_btn.setObjectName("StopwatchStartBtn")
            self.start_pause_btn.setStyleSheet("")
            
            self.lap_reset_btn.setText("Reset")
            
        # Re-apply style to reflect objectName changes
        self.start_pause_btn.style().unpolish(self.start_pause_btn)
        self.start_pause_btn.style().polish(self.start_pause_btn)

    def handle_lap_reset(self):
        if self.running:
            # LAP CAPTURE
            elapsed = self.get_current_elapsed()
            lap_num = len(self.lap_times) + 1
            
            if len(self.lap_times) == 0:
                lap_split = elapsed
            else:
                last_total = self.lap_times[-1][2]
                lap_split = elapsed - last_total
                
            self.lap_times.append((lap_num, lap_split, elapsed))
            
            # Insert at the top of the table (row 0)
            self.lap_table.insertRow(0)
            
            item_lap = QTableWidgetItem(f"Lap {lap_num}")
            item_lap.setTextAlignment(Qt.AlignmentFlag.AlignCenter)
            item_split = QTableWidgetItem(format_stopwatch_time(lap_split))
            item_split.setTextAlignment(Qt.AlignmentFlag.AlignCenter)
            item_total = QTableWidgetItem(format_stopwatch_time(elapsed))
            item_total.setTextAlignment(Qt.AlignmentFlag.AlignCenter)
            
            self.lap_table.setItem(0, 0, item_lap)
            self.lap_table.setItem(0, 1, item_split)
            self.lap_table.setItem(0, 2, item_total)
        else:
            # RESET
            self.running = False
            self.timer.stop()
            self.start_time = 0.0
            self.elapsed_before_pause = 0.0
            self.lap_times.clear()
            
            self.time_label.setText("00:00:00.000")
            self.lap_table.setRowCount(0)
            
            # Update buttons
            self.start_pause_btn.setText("Start")
            self.start_pause_btn.setObjectName("StopwatchStartBtn")
            self.start_pause_btn.setStyleSheet("")
            
            self.lap_reset_btn.setText("Reset")
            self.lap_reset_btn.setEnabled(False)
            
        # Re-apply style to reflect objectName changes
        self.start_pause_btn.style().unpolish(self.start_pause_btn)
        self.start_pause_btn.style().polish(self.start_pause_btn)
