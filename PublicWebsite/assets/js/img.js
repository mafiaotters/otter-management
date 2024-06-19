function setAvatar2(element, path) {
    file = path.slice(0,-4);
    element.setAttribute('src', file + '_1.jpg');
}

function unsetAvatar2(element, path) {
    element.setAttribute('src', path);
}