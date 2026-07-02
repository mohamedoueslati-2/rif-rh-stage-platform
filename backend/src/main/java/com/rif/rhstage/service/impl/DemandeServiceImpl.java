package com.rif.rhstage.service.impl;

import com.rif.rhstage.dto.demande.DemandeRequest;
import com.rif.rhstage.dto.demande.DemandeResponse;
import com.rif.rhstage.dto.demande.UpdateCommentaireRhRequest;
import com.rif.rhstage.dto.demande.UpdateNoteTestRequest;
import com.rif.rhstage.dto.demande.UpdateStatutDemandeRequest;
import com.rif.rhstage.entity.Candidat;
import com.rif.rhstage.entity.Demande;
import com.rif.rhstage.entity.OffreStage;
import com.rif.rhstage.entity.RH;
import com.rif.rhstage.entity.StatutDemande;
import com.rif.rhstage.exception.BadRequestException;
import com.rif.rhstage.exception.ResourceNotFoundException;
import com.rif.rhstage.mapper.DemandeMapper;
import com.rif.rhstage.repository.CandidatRepository;
import com.rif.rhstage.repository.DemandeRepository;
import com.rif.rhstage.repository.OffreStageRepository;
import com.rif.rhstage.repository.RhRepository;
import com.rif.rhstage.service.DemandeService;
import com.rif.rhstage.service.NotificationCandidatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.Year;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class DemandeServiceImpl implements DemandeService {

    private final DemandeRepository demandeRepository;
    private final CandidatRepository candidatRepository;
    private final OffreStageRepository offreStageRepository;
    private final RhRepository rhRepository;
    private final DemandeMapper demandeMapper;
    private final NotificationCandidatService notificationCandidatService;

    // Candidat : déposer une demande pour une offre
    @Override
    @Transactional
    public DemandeResponse create(UUID candidatId, UUID offreId, DemandeRequest request) {
        if (demandeRepository.existsByCandidatIdAndOffreStageId(candidatId, offreId)) {
            throw new BadRequestException("Le candidat a déjà déposé une demande pour cette offre");
        }

        Candidat candidat = candidatRepository.findById(candidatId)
                .orElseThrow(() -> new ResourceNotFoundException("Candidat introuvable"));

        OffreStage offreStage = offreStageRepository.findById(offreId)
                .orElseThrow(() -> new ResourceNotFoundException("Offre de stage introuvable"));

        validateOffreCanReceiveDemande(offreStage);

        String referenceDemande = generateReferenceDemande();

        Demande demande = demandeMapper.toEntity(
                request,
                candidat,
                offreStage,
                referenceDemande
        );

        Demande savedDemande = demandeRepository.save(demande);

        return demandeMapper.toResponse(savedDemande);
    }

    // Candidat : voir mes demandes
    @Override
    @Transactional(readOnly = true)
    public List<DemandeResponse> getMyDemandes(UUID candidatId) {
        return demandeRepository.findByCandidatId(candidatId)
                .stream()
                .map(demandeMapper::toResponse)
                .toList();
    }

    // Candidat : voir le détail de ma demande
    @Override
    @Transactional(readOnly = true)
    public DemandeResponse getMyDemandeById(UUID candidatId, UUID id) {
        Demande demande = demandeRepository.findByCandidatIdAndId(candidatId, id)
                .orElseThrow(() -> new ResourceNotFoundException("Demande introuvable"));

        return demandeMapper.toResponse(demande);
    }

    // RH : voir toutes les demandes
    @Override
    @Transactional(readOnly = true)
    public List<DemandeResponse> getAll() {
        return demandeRepository.findAll()
                .stream()
                .map(demandeMapper::toResponse)
                .toList();
    }

    // RH : voir détail d'une demande
    @Override
    @Transactional(readOnly = true)
    public DemandeResponse getById(UUID id) {
        Demande demande = findDemandeById(id);

        return demandeMapper.toResponse(demande);
    }

    // RH : changer le statut d'une demande
    @Override
    @Transactional
    public DemandeResponse updateStatut(UUID id, UUID rhId, UpdateStatutDemandeRequest request) {
        Demande demande = findDemandeById(id);
        RH rhTraitant = findRhById(rhId);

        StatutDemande ancienStatut = demande.getStatut();

        validateStatutTransition(ancienStatut, request.statut());

        demande.setStatut(request.statut());
        demande.setRhTraitant(rhTraitant);

        Demande savedDemande = demandeRepository.save(demande);

        if (ancienStatut != savedDemande.getStatut()) {
            try {
                notificationCandidatService.notifierChangementStatut(savedDemande);
            } catch (Exception e) {
                log.warn(
                        "Email de notification non envoyé pour la demande {}",
                        savedDemande.getReferenceDemande(),
                        e
                );
            }
        }

        return demandeMapper.toResponse(savedDemande);
    }

    // RH : ajouter un commentaire RH
    @Override
    @Transactional
    public DemandeResponse updateCommentaire(UUID id, UUID rhId, UpdateCommentaireRhRequest request) {
        Demande demande = findDemandeById(id);
        RH rhTraitant = findRhById(rhId);

        demande.setCommentaireRh(request.commentaireRh());
        demande.setRhTraitant(rhTraitant);

        Demande savedDemande = demandeRepository.save(demande);

        return demandeMapper.toResponse(savedDemande);
    }

    // RH : ajouter la note du test technique
    @Override
    @Transactional
    public DemandeResponse updateNoteTest(UUID id, UUID rhId, UpdateNoteTestRequest request) {
        Demande demande = findDemandeById(id);
        RH rhTraitant = findRhById(rhId);

        validateCanUpdateNoteTest(demande.getStatut());

        demande.setNoteTestTechnique(request.noteTestTechnique());
        demande.setRhTraitant(rhTraitant);

        Demande savedDemande = demandeRepository.save(demande);

        return demandeMapper.toResponse(savedDemande);
    }

    // Candidat : annuler sa demande
    @Override
    @Transactional
    public void delete(UUID id, UUID candidatId) {
        Demande demande = demandeRepository.findByCandidatIdAndId(candidatId, id)
                .orElseThrow(() -> new ResourceNotFoundException("Demande introuvable"));

        if (demande.getStatut() != StatutDemande.SOUMISE) {
            throw new BadRequestException("Impossible d'annuler une demande déjà traitée par le RH");
        }

        demandeRepository.delete(demande);
    }

    private void validateOffreCanReceiveDemande(OffreStage offreStage) {
        LocalDate today = LocalDate.now();

        if (offreStage.getDateExpiration().isBefore(today)) {
            throw new BadRequestException("Cette offre est expirée");
        }

        if (offreStage.getDateDebut().isBefore(today)) {
            throw new BadRequestException("Le stage a déjà commencé");
        }
    }

    private void validateStatutTransition(StatutDemande currentStatut, StatutDemande newStatut) {
        if (currentStatut == newStatut) {
            return;
        }

        boolean validTransition = switch (currentStatut) {
            case SOUMISE ->
                    newStatut == StatutDemande.EN_ETUDE
                            || newStatut == StatutDemande.REFUSEE;

            case EN_ETUDE ->
                    newStatut == StatutDemande.TEST_TECHNIQUE
                            || newStatut == StatutDemande.ENTRETIEN_FACE_A_FACE
                            || newStatut == StatutDemande.REFUSEE;

            case TEST_TECHNIQUE ->
                    newStatut == StatutDemande.ENTRETIEN_FACE_A_FACE
                            || newStatut == StatutDemande.ACCEPTEE
                            || newStatut == StatutDemande.REFUSEE;

            case ENTRETIEN_FACE_A_FACE ->
                    newStatut == StatutDemande.ACCEPTEE
                            || newStatut == StatutDemande.REFUSEE;

            case ACCEPTEE, REFUSEE -> false;
        };

        if (!validTransition) {
            throw new BadRequestException(
                    "Transition de statut invalide : " + currentStatut + " vers " + newStatut
            );
        }
    }

    private void validateCanUpdateNoteTest(StatutDemande statut) {
        if (statut != StatutDemande.TEST_TECHNIQUE
                && statut != StatutDemande.ENTRETIEN_FACE_A_FACE) {
            throw new BadRequestException(
                    "La note du test technique peut être ajoutée seulement après le statut TEST_TECHNIQUE"
            );
        }
    }

    private Demande findDemandeById(UUID id) {
        return demandeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Demande introuvable"));
    }

    private RH findRhById(UUID rhId) {
        return rhRepository.findById(rhId)
                .orElseThrow(() -> new ResourceNotFoundException("RH introuvable"));
    }

    private String generateReferenceDemande() {
        String reference;

        do {
            reference = "DEM-" + Year.now().getValue() + "-"
                    + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        } while (demandeRepository.existsByReferenceDemande(reference));

        return reference;
    }
}
