const { createCanvas } = require("canvas");
const GIFEncoder = require("gifencoder");
const { Readable } = require("stream");

/**
 * Génère un GIF animé d'une roue tournante qui s'arrête sur un choix gagnant.
 * @param {string[]} labels - Liste des labels à afficher sur la roue (2 à 10).
 * @returns {{ buffer: Buffer, winner: string }} - Le GIF généré et le label gagnant.
 */
module.exports = async function generateWheelGif(labels) {
    const size = 512;
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext("2d");

    const encoder = new GIFEncoder(size, size);
    encoder.start();
    encoder.setRepeat(0); // 0 = no repeat
    encoder.setDelay(33); // ~30 fps
    encoder.setQuality(10);

    const frameCount = 60;

    // Choisir un gagnant aléatoirement
    const winnerIndex = Math.floor(Math.random() * labels.length);
    const winnerLabel = labels[winnerIndex];

    // Angle à viser pour que le curseur pointe le centre du segment gagnant
    const anglePerSegment = 360 / labels.length;
    const targetAngle = (winnerIndex + 0.5) * anglePerSegment;
    const totalRotation = 360 * 5 + targetAngle; // 5 tours + angle cible

    // Fonction de décélération (ease-out cubic)
    const easeOut = t => 1 - Math.pow(1 - t, 3);

    for (let frame = 0; frame < frameCount; frame++) {
        const t = frame / (frameCount - 1);
        const easedT = easeOut(t);
        const currentAngle = easedT * totalRotation;

        // Nettoyer le canvas
        ctx.clearRect(0, 0, size, size);

        // Dessiner les segments
        const center = size / 2;
        const radius = center - 10;
        for (let i = 0; i < labels.length; i++) {
            const startAngle = ((i * anglePerSegment - currentAngle + 360) % 360) * Math.PI / 180;
            const endAngle = (((i + 1) * anglePerSegment - currentAngle + 360) % 360) * Math.PI / 180;

            ctx.beginPath();
            ctx.moveTo(center, center);
            ctx.arc(center, center, radius, startAngle, endAngle);
            ctx.closePath();

            ctx.fillStyle = getColor(i);
            ctx.fill();

            // Texte
            ctx.save();
            const midAngle = (startAngle + endAngle) / 2;
            ctx.translate(center, center);
            ctx.rotate(midAngle);
            ctx.textAlign = "right";
            ctx.fillStyle = "black";
            ctx.font = "20px Arial";
            ctx.fillText(labels[i], radius - 10, 5);
            ctx.restore();
        }

        // Curseur
        ctx.beginPath();
        ctx.moveTo(center, 0);
        ctx.lineTo(center - 10, 20);
        ctx.lineTo(center + 10, 20);
        ctx.closePath();
        ctx.fillStyle = "red";
        ctx.fill();

        encoder.addFrame(ctx);
    }

    encoder.finish();

    const buffer = encoder.out.getData();
    return { buffer, winner: winnerLabel };
};

function getColor(index) {
    const colors = [
        "#ff6384", "#36a2eb", "#cc65fe",
        "#ffce56", "#2ecc71", "#f39c12",
        "#e74c3c", "#9b59b6", "#1abc9c", "#95a5a6"
    ];
    return colors[index % colors.length];
}
