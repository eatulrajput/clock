from datetime import datetime
from utils.helpers import format_stopwatch_time, format_timer_time, get_timezone_info, matches_alarm_time

def test_format_stopwatch_time():
    assert format_stopwatch_time(0.0) == "00:00:00.000"
    assert format_stopwatch_time(1.5) == "00:00:01.500"
    assert format_stopwatch_time(65.123) == "00:01:05.123"
    assert format_stopwatch_time(3665.999) == "01:01:05.999"

def test_format_timer_time():
    assert format_timer_time(0) == "00:00:00"
    assert format_timer_time(59) == "00:00:59"
    assert format_timer_time(3665) == "01:01:05"

def test_get_timezone_info_valid():
    res = get_timezone_info("UTC")
    assert res["valid"] is True
    assert "time" in res
    assert "date" in res
    assert "offset" in res

def test_get_timezone_info_invalid():
    res = get_timezone_info("Invalid/Zone_Name")
    assert res["valid"] is False
    assert "error" in res

def test_matches_alarm_time_once():
    alarm = {"hour": 7, "minute": 30, "repeat_days": []}
    dt1 = datetime(2026, 7, 13, 7, 30, 0)
    assert matches_alarm_time(alarm, dt1) is True
    
    dt2 = datetime(2026, 7, 13, 8, 30, 0)
    assert matches_alarm_time(alarm, dt2) is False

    dt3 = datetime(2026, 7, 13, 7, 31, 0)
    assert matches_alarm_time(alarm, dt3) is False

def test_matches_alarm_time_repeat():
    alarm = {"hour": 14, "minute": 0, "repeat_days": [0, 2]}
    dt_mon = datetime(2026, 7, 13, 14, 0, 0)
    assert matches_alarm_time(alarm, dt_mon) is True
    
    dt_tue = datetime(2026, 7, 14, 14, 0, 0)
    assert matches_alarm_time(alarm, dt_tue) is False

    dt_wed = datetime(2026, 7, 15, 14, 0, 0)
    assert matches_alarm_time(alarm, dt_wed) is True
