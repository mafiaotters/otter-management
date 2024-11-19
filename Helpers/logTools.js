async function dateFormatLog(){
    const date = new Date();
    
    let formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getHours().toString().padStart(2, '0')}h${date.getMinutes().toString().padStart(2, '0')}`;
    formattedDate = `[${formattedDate}] `;

    return formattedDate;

}


module.exports = {
    dateFormatLog
};
