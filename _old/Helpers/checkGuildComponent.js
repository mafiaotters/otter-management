const checkCollectionExists = require('./checkCollectionExists');

module.exports = async (bot, guild) => {
  const db = require('../../Loader/loadDatabase');
  const serversRef = db.collection('Servers');

  console.log('Vérification de la collection des serveurs Discord...')

  try {
    // If server doesn't exist, create it
    if(await checkCollectionExists(serversRef, guild.id) == false) {
      await serversRef.doc(guild.id).set({
        name: guild.name
        // Ajouter les éléments de base ici
      });
    const guildDocRef = serversRef.doc(guild.id); //Collection of the Guild

      // Create a new sub collection 'Games' 
      guildDocRef.collection('members').doc('dummyDoc').set({});
  
    console.log(`Collection server created successful for "${guild.name}" (${guild.id})`);
  }else{
    console.log(`Collection already exists for "(${guild.name})`)
  }
  } catch (error) {
    console.log(`Error during verify collection for "${guild.name}" (${guild.id}) `, error);
  }
  console.log('Vérification terminée !')
};