const syllables = ['ach', 'ack', 'ad', 'age', 'ald', 'ale', 'an', 'ang', 'ar', 'ard',
'as', 'ash', 'at', 'ath', 'augh', 'aw', 'ban', 'bel', 'bur', 'cer',
'cha', 'che', 'dan', 'dar', 'del', 'den', 'dra', 'dyn', 'ech', 'eld',
'elm', 'em', 'en', 'end', 'eng', 'enth', 'er', 'ess', 'est', 'et',
'gar', 'gha', 'hat', 'hin', 'hon', 'ia', 'ight', 'ild', 'im', 'ina',
'ine', 'ing', 'ir', 'is', 'iss', 'it', 'kal', 'kel', 'kim', 'kin',
'ler', 'lor', 'lye', 'mor', 'mos', 'nal', 'ny', 'nys', 'old', 'om',
'on', 'or', 'orm', 'os', 'ough', 'per', 'pol', 'qua', 'que', 'rad',
'rak', 'ran', 'ray', 'ril', 'ris', 'rod', 'roth', 'ryn', 'sam',
'say', 'ser', 'shy', 'skel', 'sul', 'tai', 'tan', 'tas', 'ther',
'tia', 'tin', 'ton', 'tor', 'tur', 'um', 'und', 'unt', 'urn', 'usk',
'ust', 'ver', 'ves', 'vor', 'war', 'wor', 'yer','a', 'e', 'i', 'o', 'u', 'y', 'ae', 'ai', 'au', 'ay', 'ea', 'ee',
'ei', 'eu', 'ey', 'ia', 'ie', 'oe', 'oi', 'oo', 'ou', 'ui'];

function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function generateName() {
    const syllableCount = Math.floor(Math.random() * 3) + 2; // Generate a name with 2 to 4 syllables
    let name = "";
    for (let i = 0; i < syllableCount; i++) {
        name += getRandomElement(syllables);
    }
    return name.charAt(0).toUpperCase() + name.slice(1); // Capitalize the first letter
}

module.exports = generateName 
