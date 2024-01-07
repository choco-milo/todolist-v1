
exports.getDate = function (){
    const options = {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
}
const today = new Date().toLocaleDateString("en-US", options)

return today 
}