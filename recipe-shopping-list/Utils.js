function presentAlert(title, message) {
    const alert = new Alert();
    alert.title = title;
    alert.message = message;
    alert.present();
}

module.exports = {
    presentAlert
};