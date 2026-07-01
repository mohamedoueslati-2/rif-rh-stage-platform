CREATE TABLE personnes (
    id UUID PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    mot_de_passe_hash VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_personnes_nom_non_vide CHECK (length(trim(nom)) > 0),
    CONSTRAINT chk_personnes_prenom_non_vide CHECK (length(trim(prenom)) > 0),
    CONSTRAINT chk_personnes_email_non_vide CHECK (length(trim(email)) > 0)
);

CREATE TABLE candidats (
    id UUID PRIMARY KEY,
    telephone VARCHAR(30),
    specialite VARCHAR(100),
    niveau_etude VARCHAR(100),
    CONSTRAINT fk_candidat_personne
        FOREIGN KEY (id) REFERENCES personnes(id)
        ON DELETE CASCADE
);

CREATE TABLE rh (
    id UUID PRIMARY KEY,
    nom_affichage VARCHAR(100),
    contact_professionnel VARCHAR(150),
    CONSTRAINT fk_rh_personne
        FOREIGN KEY (id) REFERENCES personnes(id)
        ON DELETE CASCADE
);

CREATE TABLE offres_stage (
    id UUID PRIMARY KEY,
    reference_offre VARCHAR(100) NOT NULL UNIQUE,
    titre VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    domaine VARCHAR(100),
    lieu VARCHAR(100),
    duree VARCHAR(100),
    date_debut DATE,
    date_expiration DATE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    rh_id UUID NOT NULL,
    CONSTRAINT fk_offre_rh
        FOREIGN KEY (rh_id) REFERENCES rh(id),
    CONSTRAINT chk_reference_offre_non_vide CHECK (length(trim(reference_offre)) > 0),
    CONSTRAINT chk_titre_offre_non_vide CHECK (length(trim(titre)) > 0),
    CONSTRAINT chk_description_offre_non_vide CHECK (length(trim(description)) > 0)
);

CREATE TABLE demandes (
    id UUID PRIMARY KEY,
    reference_demande VARCHAR(100) NOT NULL UNIQUE,
    date_demande TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    lettre_motivation_url VARCHAR(500),
    cv_url VARCHAR(500) NOT NULL,
    statut VARCHAR(50) NOT NULL DEFAULT 'SOUMISE',
    note_test_technique DOUBLE PRECISION,
    commentaire_rh TEXT,
    updated_at TIMESTAMP,
    candidat_id UUID NOT NULL,
    offre_stage_id UUID NOT NULL,
    rh_traiteur_id UUID,
    CONSTRAINT fk_demande_candidat
        FOREIGN KEY (candidat_id) REFERENCES candidats(id),
    CONSTRAINT fk_demande_offre
        FOREIGN KEY (offre_stage_id) REFERENCES offres_stage(id),
    CONSTRAINT fk_demande_rh
        FOREIGN KEY (rh_traiteur_id) REFERENCES rh(id),
    CONSTRAINT chk_reference_demande_non_vide CHECK (length(trim(reference_demande)) > 0),
    CONSTRAINT chk_cv_url_non_vide CHECK (length(trim(cv_url)) > 0),
    CONSTRAINT chk_statut_demande CHECK (statut IN (
        'SOUMISE',
        'EN_ETUDE',
        'TEST_TECHNIQUE',
        'ENTRETIEN_FACE_A_FACE',
        'ACCEPTEE',
        'REFUSEE'
    ))
);
