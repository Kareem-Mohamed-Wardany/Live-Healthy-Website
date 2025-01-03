function formatTime(time) {
    let [hours, minutes] = time.split(":");
    hours = parseInt(hours, 10);
    const period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convert 0 to 12 (midnight) and 13-23 to 1-11 PM
    return `${hours}:${minutes} ${period}`;
}
export default formatTime