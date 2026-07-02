CREATE EXTENSION IF NOT EXISTS pgcrypto;

DROP TABLE IF EXISTS demandes CASCADE;
DROP TABLE IF EXISTS offres_stage CASCADE;
DROP TABLE IF EXISTS candidats CASCADE;
DROP TABLE IF EXISTS rh CASCADE;
DROP TABLE IF EXISTS personnes CASCADE;

CREATE TABLE personnes (
                           id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

                           nom VARCHAR(100) NOT NULL,
                           prenom VARCHAR(100) NOT NULL,
                           email VARCHAR(150) NOT NULL UNIQUE,
                           mot_de_passe_hash VARCHAR(255) NOT NULL,

                           created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                           CONSTRAINT chk_personnes_nom_non_vide
                               CHECK (length(trim(nom)) > 0),

                           CONSTRAINT chk_personnes_prenom_non_vide
                               CHECK (length(trim(prenom)) > 0),

                           CONSTRAINT chk_personnes_email_non_vide
                               CHECK (length(trim(email)) > 0)
);

CREATE TABLE candidats (
                           id UUID PRIMARY KEY,

                           telephone VARCHAR(30),
                           specialite VARCHAR(120),
                           niveau_etude VARCHAR(120),

                           CONSTRAINT fk_candidat_personne
                               FOREIGN KEY (id)
                                   REFERENCES personnes(id)
                                   ON DELETE CASCADE
);

CREATE TABLE rh (
                    id UUID PRIMARY KEY,

                    nom_affichage VARCHAR(120),
                    contact_professionnel VARCHAR(150),

                    CONSTRAINT fk_rh_personne
                        FOREIGN KEY (id)
                            REFERENCES personnes(id)
                            ON DELETE CASCADE
);

CREATE TABLE offres_stage (
                              id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

                              reference_offre VARCHAR(50) NOT NULL UNIQUE,
                              titre VARCHAR(255) NOT NULL,
                              description TEXT NOT NULL,

                              domaine VARCHAR(255),
                              lieu VARCHAR(255),
                              duree VARCHAR(255),

                              date_debut DATE,
                              date_expiration DATE,

                              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                              rh_createur_id UUID NOT NULL,

                              CONSTRAINT fk_offre_rh_createur
                                  FOREIGN KEY (rh_createur_id)
                                      REFERENCES rh(id),

                              CONSTRAINT chk_reference_offre_non_vide
                                  CHECK (length(trim(reference_offre)) > 0),

                              CONSTRAINT chk_titre_offre_non_vide
                                  CHECK (length(trim(titre)) > 0),

                              CONSTRAINT chk_description_offre_non_vide
                                  CHECK (length(trim(description)) > 0)
);

CREATE TABLE demandes (
                          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

                          reference_demande VARCHAR(50) NOT NULL UNIQUE,

                          date_demande TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                          lettre_motivation_url VARCHAR(500),
                          cv_url VARCHAR(500) NOT NULL,

                          statut VARCHAR(50) DEFAULT 'SOUMISE',

                          note_test_technique DOUBLE PRECISION,

                          commentaire_rh TEXT,

                          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                          candidat_id UUID NOT NULL,
                          offre_stage_id UUID NOT NULL,
                          rh_traitant_id UUID,

                          CONSTRAINT fk_demande_candidat
                              FOREIGN KEY (candidat_id)
                                  REFERENCES candidats(id),

                          CONSTRAINT fk_demande_offre_stage
                              FOREIGN KEY (offre_stage_id)
                                  REFERENCES offres_stage(id),

                          CONSTRAINT fk_demande_rh_traitant
                              FOREIGN KEY (rh_traitant_id)
                                  REFERENCES rh(id),

                          CONSTRAINT chk_reference_demande_non_vide
                              CHECK (length(trim(reference_demande)) > 0),

                          CONSTRAINT chk_cv_url_non_vide
                              CHECK (length(trim(cv_url)) > 0),

                          CONSTRAINT chk_statut_demande
                              CHECK (statut IN (
                                                'SOUMISE',
                                                'EN_ETUDE',
                                                'TEST_TECHNIQUE',
                                                'ENTRETIEN_FACE_A_FACE',
                                                'ACCEPTEE',
                                                'REFUSEE'
                                  ))
);