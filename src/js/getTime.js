function getTime(type = 'long') {
    const date = new Date();
    if(type !== 'short') {
        return String(date);
    }
    const formatDate = new Intl.DateTimeFormat('en', {
        hour: 'numeric',
        minute: 'numeric',
        weekday: 'long',
        month: 'long',
        year: 'numeric',
        hour12: true
    });
    return formatDate.format(date);
}

export default getTime;