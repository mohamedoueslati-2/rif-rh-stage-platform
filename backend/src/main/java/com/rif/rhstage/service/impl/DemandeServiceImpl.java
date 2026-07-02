package com.rif.rhstage.service.impl;

import com.rif.rhstage.dto.demande.DemandeRequest;
import com.rif.rhstage.dto.demande.DemandeResponse;
import com.rif.rhstage.dto.demande.UpdateCommentaireRhRequest;
import com.rif.rhstage.dto.demande.UpdateStatutDemandeRequest;
import com.rif.rhstage.entity.Candidat;
import com.rif.rhstage.entity.Demande;
import com.rif.rhstage.entity.OffreStage;
import com.rif.rhstage.entity.RH;
import com.rif.rhstage.exception.BadRequestException;
import com.rif.rhstage.exception.ResourceNotFoundException;
import com.rif.rhstage.mapper.DemandeMapper;
import com.rif.rhstage.repository.CandidatRepository;
import com.rif.rhstage.repository.DemandeRepository;
import com.rif.rhstage.repository.OffreStageRepository;
import com.rif.rhstage.repository.RhRepository;
import com.rif.rhstage.service.DemandeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.Year;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DemandeServiceImpl implements DemandeService {

    private final DemandeRepository demandeRepository;
    private final CandidatRepository candidatRepository;
    private final OffreStageRepository offreStageRepository;
    private final RhRepository rhRepository;
    private final DemandeMapper demandeMapper;

    // Créer une demande de stage pour un candidat
    @Override
    @Transactional
    public DemandeResponse create(DemandeRequest request) {
        if (demandeRepository.existsByCandidatIdAndOffreStageId(request.candidatId(), request.offreStageId())) {
            throw new BadRequestException("Le candidat a déjà déposé une demande pour cette offre");
        }

        Candidat candidat = candidatRepository.findById(request.candidatId())
                .orElseThrow(() -> new ResourceNotFoundException("Candidat introuvable"));

        OffreStage offreStage = offreStageRepository.findById(request.offreStageId())
                .orElseThrow(() -> new ResourceNotFoundException("Offre de stage introuvable"));

        if (offreStage.getDateExpiration().isBefore(LocalDate.now())) {
            throw new BadRequestException("Cette offre est expirée");
        }

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

    // Récupérer toutes les demandes
    @Override
    @Transactional(readOnly = true)
    public List<DemandeResponse> getAll() {
        return demandeRepository.findAll()
                .stream()
                .map(demandeMapper::toResponse)
                .toList();
    }

    // Récupérer une demande par son ID
    @Override
    @Transactional(readOnly = true)
    public DemandeResponse getById(UUID id) {
        Demande demande = demandeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Demande introuvable"));

        return demandeMapper.toResponse(demande);
    }

    // Récupérer les demandes d'un candidat
    @Override
    @Transactional(readOnly = true)
    public List<DemandeResponse> getByCandidatId(UUID candidatId) {
        return demandeRepository.findByCandidatId(candidatId)
                .stream()
                .map(demandeMapper::toResponse)
                .toList();
    }

    // Récupérer les demandes reçues par une offre
    @Override
    @Transactional(readOnly = true)
    public List<DemandeResponse> getByOffreStageId(UUID offreStageId) {
        return demandeRepository.findByOffreStageId(offreStageId)
                .stream()
                .map(demandeMapper::toResponse)
                .toList();
    }

    // Modifier le statut d'une demande par le RH
    @Override
    @Transactional
    public DemandeResponse updateStatut(UUID id, UpdateStatutDemandeRequest request) {
        Demande demande = demandeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Demande introuvable"));

        demande.setStatut(request.statut());

        if (request.rhTraitantId() != null) {
            RH rhTraitant = rhRepository.findById(request.rhTraitantId())
                    .orElseThrow(() -> new ResourceNotFoundException("RH traitant introuvable"));

            demande.setRhTraitant(rhTraitant);
        }

        Demande savedDemande = demandeRepository.save(demande);

        return demandeMapper.toResponse(savedDemande);
    }

    // Modifier le commentaire RH sur une demande
    @Override
    @Transactional
    public DemandeResponse updateCommentaire(UUID id, UpdateCommentaireRhRequest request) {
        Demande demande = demandeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Demande introuvable"));

        demande.setCommentaireRh(request.commentaireRh());

        Demande savedDemande = demandeRepository.save(demande);

        return demandeMapper.toResponse(savedDemande);
    }

    // Générer une référence unique pour chaque demande
    private String generateReferenceDemande() {
        String reference;

        do {
            reference = "DEM-" + Year.now().getValue() + "-"
                    + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        } while (demandeRepository.existsByReferenceDemande(reference));

        return reference;
    }
}

