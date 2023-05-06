function stringToColor(string) {
    let hash = 0;

    for (let i = 0; i < string.length; ++i) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (let i = 0; i < 3; ++i) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }

    return color;
}

function stringAvatar(name) {
    if (!name?.trim()) {
        return {};
    }

    name = name.trim();
    let firstChar = name.split(' ')[0][0],
        secondChar = '';
    if (name.split(' ')[1]) {
        secondChar = name.split(' ')[1][0];
    }

    return {
        sx: {
            bgcolor: stringToColor(name),
        },
        children: `${firstChar}${secondChar}`,
    };
}

export { stringToColor, stringAvatar };
