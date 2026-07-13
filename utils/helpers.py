import zoneinfo
from datetime import datetime

def format_stopwatch_time(elapsed_seconds: float) -> str:
    """Formats seconds into HH:MM:SS.zzz (hours, minutes, seconds, milliseconds)."""
    total_ms = int(round(elapsed_seconds * 1000))
    hours = total_ms // 3600000
    minutes = (total_ms % 3600000) // 60000
    seconds = (total_ms % 60000) // 1000
    milliseconds = total_ms % 1000
    return f"{hours:02}:{minutes:02}:{seconds:02}.{milliseconds:03}"

def format_timer_time(seconds: int) -> str:
    """Formats integer seconds into HH:MM:SS."""
    hours = seconds // 3600
    minutes = (seconds % 3600) // 60
    secs = seconds % 60
    return f"{hours:02}:{minutes:02}:{secs:02}"

def get_timezone_info(tz_name: str) -> dict:
    """
    Returns current time, date string, and offset string for a timezone relative to local time.
    """
    try:
        tz = zoneinfo.ZoneInfo(tz_name)
        # Handle cases where system local timezone might be UTC or failed to resolve
        try:
            local_tz = datetime.now().astimezone().tzinfo
        except Exception:
            local_tz = zoneinfo.ZoneInfo("UTC")

        now_utc = datetime.now(zoneinfo.ZoneInfo("UTC"))
        now_tz = now_utc.astimezone(tz)
        now_local = now_utc.astimezone(local_tz)

        # Calculate offset difference in hours
        offset_tz = now_tz.utcoffset()
        offset_local = now_local.utcoffset()

        if offset_tz is not None and offset_local is not None:
            diff_seconds = offset_tz.total_seconds() - offset_local.total_seconds()
            diff_hours = diff_seconds / 3600.0
            if diff_hours == 0:
                offset_str = "Same time"
            else:
                sign = "+" if diff_hours > 0 else "-"
                # Format to remove trailing .0 if integer difference
                val = f"{abs(diff_hours):.1f}"
                if val.endswith(".0"):
                    val = val[:-2]
                offset_str = f"{sign}{val}h"
        else:
            offset_str = ""

        # Format time (12-hour format with AM/PM) and date
        time_str = now_tz.strftime("%I:%M:%S %p")
        day_tz = now_tz.date()
        day_local = now_local.date()

        if day_tz == day_local:
            day_rel = "Today"
        elif day_tz > day_local:
            day_rel = "Tomorrow"
        else:
            day_rel = "Yesterday"

        return {
            "time": time_str,
            "date": f"{day_rel}, {now_tz.strftime('%b %d')}",
            "offset": offset_str,
            "valid": True
        }
    except Exception as e:
        return {"valid": False, "error": str(e)}

def matches_alarm_time(alarm: dict, dt: datetime) -> bool:
    """
    Checks if the given datetime matches the alarm configuration (hour, minute, and repeating day).
    Does not check if the alarm is enabled.
    """
    if dt.hour != alarm.get("hour") or dt.minute != alarm.get("minute"):
        return False
    
    repeat_days = alarm.get("repeat_days", [])
    if not repeat_days:
        # One-time alarm matches any day
        return True
    else:
        # Repeating alarm: check if weekday matches (datetime.weekday(): Monday=0, Sunday=6)
        return dt.weekday() in repeat_days
