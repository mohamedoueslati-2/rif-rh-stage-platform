package com.rif.rhstage.service;

import com.rif.rhstage.entity.Demande;
import com.rif.rhstage.entity.StatutDemande;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationCandidatService {

    private final EmailService emailService;

    public void notifierChangementStatut(Demande demande) {
        String emailCandidat = demande.getCandidat().getEmail();

        if (emailCandidat == null || emailCandidat.isBlank()) {
            return;
        }

        StatutDemande statut = demande.getStatut();
        String sujet = getSujet(statut);
        String message = getMessage(demande);

        if (sujet == null || message == null) {
            return;
        }

        emailService.envoyerEmail(emailCandidat, sujet, message);
    }

    private String getSujet(StatutDemande statut) {
        return switch (statut) {
            case EN_ETUDE -> "Mise à jour de votre demande de stage";
            case TEST_TECHNIQUE -> "Test technique - Candidature stage";
            case ENTRETIEN_FACE_A_FACE -> "Entretien - Candidature stage";
            case ACCEPTEE -> "Demande de stage acceptée";
            case REFUSEE -> "Demande de stage refusée";
            case SOUMISE -> null;
        };
    }

    private String getMessage(Demande demande) {
        String nomComplet = demande.getCandidat().getPrenom() + " " + demande.getCandidat().getNom();
        String titreOffre = demande.getOffreStage().getTitre();

        return switch (demande.getStatut()) {
            case EN_ETUDE -> """
                    Bonjour %s,

                    Votre demande de stage pour l’offre "%s" est actuellement en cours d’étude par notre équipe RH.

                    Nous vous informerons dès qu’une nouvelle étape sera disponible.

                    Cordialement,
                    Service RH
                    """.formatted(nomComplet, titreOffre);

            case TEST_TECHNIQUE -> """
                    Bonjour %s,

                    Votre candidature pour l’offre "%s" a été présélectionnée.

                    Vous recevrez prochainement un test technique à compléter dans le cadre du processus de sélection.

                    Cordialement,
                    Service RH
                    """.formatted(nomComplet, titreOffre);

            case ENTRETIEN_FACE_A_FACE -> """
                    Bonjour %s,

                    Votre candidature pour l’offre "%s" a été retenue pour l’étape de l’entretien.

                    L’équipe RH vous contactera prochainement pour fixer la date et les détails de l’entretien.

                    Cordialement,
                    Service RH
                    """.formatted(nomComplet, titreOffre);

            case ACCEPTEE -> """
                    Bonjour %s,

                    Nous avons le plaisir de vous informer que votre demande de stage pour l’offre "%s" a été acceptée.

                    L’équipe RH vous contactera prochainement pour finaliser les prochaines étapes.

                    Cordialement,
                    Service RH
                    """.formatted(nomComplet, titreOffre);

            case REFUSEE -> """
                    Bonjour %s,

                    Nous vous remercions pour votre candidature à l’offre "%s".

                    Après étude de votre dossier, nous sommes au regret de vous informer que votre demande de stage n’a pas été retenue.

                    Nous vous souhaitons une bonne continuation.

                    Cordialement,
                    Service RH
                    """.formatted(nomComplet, titreOffre);

            case SOUMISE -> null;
        };
    }
}
