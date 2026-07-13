import time
import json
from datetime import datetime
from PyQt6.QtWidgets import (QWidget, QVBoxLayout, QHBoxLayout, QLabel, QLineEdit,
                             QPushButton, QScrollArea, QFrame, QCheckBox, QTimeEdit, QMessageBox)
from PyQt6.QtCore import QTimer, Qt, QSettings, QTime
from utils.helpers import matches_alarm_time

class AlarmCard(QFrame):
    def __init__(self, alarm_data, on_toggle, on_remove, parent=None):
        super().__init__(parent)
        self.alarm_id = alarm_data["id"]
        self.hour = alarm_data["hour"]
        self.minute = alarm_data["minute"]
        self.label = alarm_data["label"]
        self.enabled = alarm_data["enabled"]
        self.repeat_days = alarm_data["repeat_days"]
        self.on_toggle = on_toggle
        self.on_remove = on_remove
        self.flash_timer = QTimer(self)
        self.flash_state = False
        self.init_ui()

    def init_ui(self):
        self.setObjectName("AlarmCard")
        self.update_style()
        
        layout = QHBoxLayout(self)
        layout.setContentsMargins(15, 12, 15, 12)
        layout.setSpacing(15)

        # Left Column: Time & description details
        left_layout = QVBoxLayout()
        left_layout.setSpacing(4)

        # Time formatting
        qtime = QTime(self.hour, self.minute)
        time_str = qtime.toString("hh:mm AP")
        self.time_label = QLabel(time_str, self)
        self.time_label.setObjectName("AlarmCardTime")
        
        self.desc_label = QLabel(self.label if self.label else "Alarm", self)
        self.desc_label.setObjectName("AlarmCardDesc")
        
        # Days translation
        days_names = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        if not self.repeat_days:
            repeat_str = "Once"
        elif len(self.repeat_days) == 7:
            repeat_str = "Every day"
        elif set(self.repeat_days) == {0, 1, 2, 3, 4} and len(self.repeat_days) == 5:
            repeat_str = "Weekdays"
        elif set(self.repeat_days) == {5, 6} and len(self.repeat_days) == 2:
            repeat_str = "Weekends"
        else:
            repeat_str = ", ".join(days_names[d] for d in sorted(self.repeat_days))
            
        self.repeat_label = QLabel(repeat_str, self)
        self.repeat_label.setObjectName("AlarmCardRepeat")
        
        left_layout.addWidget(self.time_label)
        left_layout.addWidget(self.desc_label)
        left_layout.addWidget(self.repeat_label)

        # Right Column: Enabled checkbox & Remove button
        right_layout = QHBoxLayout()
        right_layout.setSpacing(15)

        self.enable_checkbox = QCheckBox("Active", self)
        self.enable_checkbox.setChecked(self.enabled)
        self.enable_checkbox.toggled.connect(self.handle_toggle)
        
        self.remove_btn = QPushButton("×", self)
        self.remove_btn.setObjectName("AlarmCardRemoveBtn")
        self.remove_btn.setFixedSize(28, 28)
        self.remove_btn.clicked.connect(lambda: self.on_remove(self))

        right_layout.addWidget(self.enable_checkbox)
        right_layout.addWidget(self.remove_btn)

        layout.addLayout(left_layout)
        layout.addStretch()
        layout.addLayout(right_layout)
        
        # Flash timer setup
        self.flash_timer.timeout.connect(self.blink_card)

    def handle_toggle(self, checked):
        self.enabled = checked
        self.update_style()
        self.on_toggle(self.alarm_id, checked)

    def update_style(self):
        if self.enabled:
            self.setStyleSheet("QFrame#AlarmCard { background-color: #1e1e1e; border: 1px solid #0072ff; }")
        else:
            self.setStyleSheet("QFrame#AlarmCard { background-color: #151515; border: 1px solid #222222; }")

    def start_flash(self):
        self.flash_state = True
        self.flash_timer.start(500)
        self.blink_card()

    def stop_flash(self):
        self.flash_timer.stop()
        self.update_style()

    def blink_card(self):
        if self.flash_state:
            self.setStyleSheet("QFrame#AlarmCard { background-color: #55171e; border: 1px solid #ff1744; }")
        else:
            self.update_style()
        self.flash_state = not self.flash_state


class AlarmClockTab(QWidget):
    def __init__(self, parent=None):
        super().__init__(parent)
        self.alarms = []
        self.cards = {}  # alarm_id -> AlarmCard
        self.settings = QSettings("LinuxClockApp", "Alarms")
        self.triggered_this_minute = set()
        self.last_checked_minute = None
        self.active_alert_card = None
        
        self.init_ui()
        self.load_alarms()
        
    def init_ui(self):
        # Layout
        main_layout = QVBoxLayout(self)
        main_layout.setContentsMargins(20, 20, 20, 20)
        main_layout.setSpacing(15)
        
        # Top Panel: Add Alarm Section
        add_panel = QFrame(self)
        add_panel.setObjectName("AlarmAddPanel")
        add_panel_layout = QVBoxLayout(add_panel)
        add_panel_layout.setSpacing(10)
        add_panel_layout.setContentsMargins(15, 15, 15, 15)
        
        # Row 1: Time selection & Label input
        row1 = QHBoxLayout()
        row1.setSpacing(15)
        
        self.time_edit = QTimeEdit(self)
        self.time_edit.setObjectName("AlarmTimeEdit")
        self.time_edit.setTime(QTime.currentTime())
        
        self.label_edit = QLineEdit(self)
        self.label_edit.setPlaceholderText("Alarm Label (e.g. Wake up!)")
        self.label_edit.setObjectName("AlarmLabelEdit")
        
        row1.addWidget(QLabel("Time:"))
        row1.addWidget(self.time_edit)
        row1.addWidget(QLabel("Label:"))
        row1.addWidget(self.label_edit)
        add_panel_layout.addLayout(row1)
        
        # Row 2: Day Repeat Toggle Buttons
        row2 = QHBoxLayout()
        row2.setSpacing(8)
        row2.addWidget(QLabel("Repeat on:"))
        
        self.day_buttons = []
        days_letters = ["M", "T", "W", "T", "F", "S", "S"]
        for i, letter in enumerate(days_letters):
            btn = QPushButton(letter, self)
            btn.setCheckable(True)
            btn.setObjectName(f"AlarmDayBtn_{i}")
            btn.setProperty("day_index", i)
            # Custom sizing for circular/square shape
            btn.setFixedSize(30, 30)
            btn.setStyleSheet("""
                QPushButton {
                    border-radius: 15px;
                    border: 1px solid #3c3c3c;
                    background-color: #222222;
                    color: #b3b3b3;
                    font-weight: bold;
                }
                QPushButton:checked {
                    background-color: #0072ff;
                    color: white;
                    border: none;
                }
            """)
            row2.addWidget(btn)
            self.day_buttons.append(btn)
            
        row2.addStretch()
        
        self.add_btn = QPushButton("Add Alarm", self)
        self.add_btn.setObjectName("AlarmAddBtn")
        self.add_btn.setFixedSize(120, 32)
        self.add_btn.clicked.connect(self.add_alarm)
        row2.addWidget(self.add_btn)
        
        add_panel_layout.addLayout(row2)
        main_layout.addWidget(add_panel)
        
        # Scroll Area for alarms list
        self.scroll_area = QScrollArea(self)
        self.scroll_area.setWidgetResizable(True)
        self.scroll_area.setObjectName("AlarmScroll")
        
        self.scroll_content = QWidget()
        self.scroll_content.setObjectName("AlarmScrollContent")
        self.scroll_layout = QVBoxLayout(self.scroll_content)
        self.scroll_layout.setAlignment(Qt.AlignmentFlag.AlignTop)
        self.scroll_layout.setSpacing(10)
        self.scroll_layout.setContentsMargins(0, 0, 0, 0)
        
        self.scroll_area.setWidget(self.scroll_content)
        main_layout.addWidget(self.scroll_area)
        
        # Check alarm conditions every 1 second
        self.check_timer = QTimer(self)
        self.check_timer.timeout.connect(self.check_alarms)
        self.check_timer.start(1000)

    def add_alarm(self):
        qtime = self.time_edit.time()
        hour = qtime.hour()
        minute = qtime.minute()
        label = self.label_edit.text().strip()
        
        # Collect repeating days
        repeat_days = []
        for btn in self.day_buttons:
            if btn.isChecked():
                repeat_days.append(btn.property("day_index"))
                
        alarm_id = str(int(time.time() * 1000))  # Unique string ID
        alarm_data = {
            "id": alarm_id,
            "hour": hour,
            "minute": minute,
            "label": label,
            "enabled": True,
            "repeat_days": repeat_days
        }
        
        self.alarms.append(alarm_data)
        self.create_card(alarm_data)
        self.save_alarms()
        
        # Reset fields
        self.label_edit.clear()
        for btn in self.day_buttons:
            btn.setChecked(False)
            
    def create_card(self, alarm_data):
        card = AlarmCard(alarm_data, self.toggle_alarm, self.remove_alarm, self)
        self.scroll_layout.addWidget(card)
        self.cards[alarm_data["id"]] = card
        
    def toggle_alarm(self, alarm_id, enabled):
        for alarm in self.alarms:
            if alarm["id"] == alarm_id:
                alarm["enabled"] = enabled
                break
        self.save_alarms()
        
    def remove_alarm(self, card):
        alarm_id = card.alarm_id
        # If it was flashing, stop it
        card.stop_flash()
        if self.active_alert_card == card:
            self.active_alert_card = None
            
        self.scroll_layout.removeWidget(card)
        if alarm_id in self.cards:
            del self.cards[alarm_id]
        
        self.alarms = [a for a in self.alarms if a["id"] != alarm_id]
        card.deleteLater()
        self.save_alarms()

    def check_alarms(self):
        now = datetime.now()
        current_min_key = (now.year, now.month, now.day, now.hour, now.minute)
        
        if current_min_key != self.last_checked_minute:
            self.triggered_this_minute.clear()
            self.last_checked_minute = current_min_key
            
        for alarm in self.alarms:
            if not alarm["enabled"]:
                continue
            if alarm["id"] in self.triggered_this_minute:
                continue
                
            if matches_alarm_time(alarm, now):
                self.triggered_this_minute.add(alarm["id"])
                self.trigger_alarm(alarm)

    def trigger_alarm(self, alarm):
        card = self.cards.get(alarm["id"])
        if card:
            card.start_flash()
            self.active_alert_card = card
            
        print("\a", end="", flush=True)  # System beep
        
        # Display modal alarm trigger
        msg = QMessageBox(self)
        msg.setWindowTitle("Alarm Triggered")
        qtime = QTime(alarm["hour"], alarm["minute"])
        label_text = alarm["label"] if alarm["label"] else "Alarm"
        msg.setText(f"⏰ {qtime.toString('hh:mm AP')}\n\n{label_text}")
        msg.setIcon(QMessageBox.Icon.Information)
        msg.setStandardButtons(QMessageBox.StandardButton.Ok)
        
        # Disable if single-use (no repeating days)
        if not alarm["repeat_days"]:
            alarm["enabled"] = False
            if card:
                card.enable_checkbox.setChecked(False)
            self.save_alarms()
            
        msg.finished.connect(self.dismiss_alarm)
        msg.exec()

    def dismiss_alarm(self):
        if self.active_alert_card:
            self.active_alert_card.stop_flash()
            self.active_alert_card = None

    def save_alarms(self):
        self.settings.setValue("alarms_json", json.dumps(self.alarms))

    def load_alarms(self):
        alarms_json = self.settings.value("alarms_json", "[]")
        try:
            # Handle cases where settings value is empty or malformed
            if isinstance(alarms_json, str):
                self.alarms = json.loads(alarms_json)
            else:
                self.alarms = []
        except Exception:
            self.alarms = []
            
        for alarm in self.alarms:
            self.create_card(alarm)
