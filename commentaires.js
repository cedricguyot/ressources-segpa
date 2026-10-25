
/* =========================================
   PROF DE SEGPA — COMMENTAIRES
   Version de démonstration
   ========================================= */
   const SUPABASE_URL = "https://xpaoesrdufpirkfzkbdd.supabase.co";
   const SUPABASE_KEY = "sb_publishable_ktmvnPWlK4XvXgs2wRrTZA_tKTidU2A";

document.addEventListener("DOMContentLoaded", async function () {
	let dernierEnvoi = 0;

    let commentaires = [];
	try {
    const reponse = await fetch(
        SUPABASE_URL + "/rest/v1/commentaires?select=pseudo,message,reponse,created_at&page=eq.automatismes&approuve=eq.true&order=created_at.desc",
        {
            headers: {
                "apikey": SUPABASE_KEY
            }
        }
    );
	   
    if (!reponse.ok) {
        throw new Error("Erreur de lecture des commentaires");
    }
	const donnees = await reponse.json();
	
	commentaires = donnees.map(function (item) {
    return {
        auteur: item.pseudo,
        message: item.message,
        reponse: item.reponse,
        date: new Date(item.created_at).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric"
        })
    };
});

	}
	catch (erreur) {
    console.error("Erreur Supabase :", erreur);
	}
	
	// Création de la zone des commentaires

    const espace = document.querySelector(".espace-commentaires");

    if (!espace) return;

    const zone = document.createElement("section");
    zone.className = "commentaires-publies";

       // Affichage de chaque commentaire

    commentaires.forEach(function (commentaire) {

        const bloc = document.createElement("article");
        bloc.className = "commentaire";

        const entete = document.createElement("div");
        entete.className = "commentaire-entete";

        const auteur = document.createElement("strong");
        auteur.textContent = commentaire.auteur;

        const date = document.createElement("span");
        date.textContent = commentaire.date;

        entete.appendChild(auteur);
        entete.appendChild(date);

        const message = document.createElement("p");
        message.className = "commentaire-texte";
        message.textContent = commentaire.message;

        bloc.appendChild(entete);
        bloc.appendChild(message);

        // Réponse éventuelle de Prof de SEGPA

        if (commentaire.reponse) {

            const reponse = document.createElement("div");
            reponse.className = "reponse-commentaire";

            const signature = document.createElement("strong");
            signature.textContent = "Cédric";

            const texte = document.createElement("p");
            texte.textContent = commentaire.reponse;

            reponse.appendChild(signature);
            reponse.appendChild(texte);

            bloc.appendChild(reponse);
        }

        zone.appendChild(bloc);
    });

    // Insertion sous le formulaire
	
	if (commentaires.length > 0) {
    espace.insertAdjacentElement("afterend", zone);
	}
	const formulaire = document.querySelector(".formulaire-commentaire");
	if (!formulaire) return;
	
	formulaire.addEventListener("submit", async function (evenement) {
    evenement.preventDefault();
	const maintenant = Date.now();

if (maintenant - dernierEnvoi < 60000) {
    alert("Veuillez patienter une minute avant d'envoyer un autre message.");
    return;
}
	
	const bouton = formulaire.querySelector('button[type="submit"]');
	if (bouton.disabled) return;
	bouton.disabled = true;
	
	const pseudo = formulaire.querySelector('[name="pseudo"]').value.trim();
    const message = formulaire.querySelector('[name="message"]').value.trim();
	if (!pseudo || !message) {
    alert("Veuillez remplir les deux champs.");
	bouton.disabled = false;
    return;
}
const nouveauCommentaire = {
    pseudo: pseudo,
    message: message,
    page: "automatismes"
};
try {
    const reponse = await fetch(
        SUPABASE_URL + "/rest/v1/commentaires",
        {
            method: "POST",
            headers: {
                "apikey": SUPABASE_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(nouveauCommentaire)
        }
    );
	if (!reponse.ok) {
    throw new Error("Supabase a refusé le commentaire");
}
dernierEnvoi = Date.now();
alert("Votre message a bien été envoyé. Il sera publié après vérification.");
formulaire.reset();

} catch (erreur) {
    console.error("Erreur d'envoi :", erreur);
    alert("Votre message n'a pas pu être envoyé. Veuillez réessayer plus tard.");
}
finally {
    bouton.disabled = false;
}

});

});
