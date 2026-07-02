package com.rif.rhstage.service.impl;

import com.rif.rhstage.dto.offre.OffreStageRequest;
import com.rif.rhstage.dto.offre.OffreStageResponse;
import com.rif.rhstage.entity.OffreStage;
import com.rif.rhstage.entity.RH;
import com.rif.rhstage.exception.BadRequestException;
import com.rif.rhstage.exception.ResourceNotFoundException;
import com.rif.rhstage.mapper.OffreStageMapper;
import com.rif.rhstage.repository.OffreStageRepository;
import com.rif.rhstage.repository.RhRepository;
import com.rif.rhstage.service.OffreStageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OffreStageServiceImpl implements OffreStageService {

    private final OffreStageRepository offreStageRepository;
    private final RhRepository rhRepository;
    private final OffreStageMapper offreStageMapper;

    // Créer une offre de stage par un RH
    @Override
    @Transactional
    public OffreStageResponse create(OffreStageRequest request) {
        if (offreStageRepository.existsByReferenceOffre(request.referenceOffre())) {
            throw new BadRequestException("Référence offre déjà utilisée");
        }

        if (request.dateExpiration().isBefore(request.dateDebut())) {
            throw new BadRequestException("La date d'expiration doit être après la date de début");
        }

        RH rhCreateur = rhRepository.findById(request.rhCreateurId())
                .orElseThrow(() -> new ResourceNotFoundException("RH créateur introuvable"));

        OffreStage offreStage = offreStageMapper.toEntity(request, rhCreateur);
        OffreStage savedOffre = offreStageRepository.save(offreStage);

        return offreStageMapper.toResponse(savedOffre);
    }

    // Récupérer toutes les offres
    @Override
    @Transactional(readOnly = true)
    public List<OffreStageResponse> getAll() {
        return offreStageRepository.findAll()
                .stream()
                .map(offreStageMapper::toResponse)
                .toList();
    }

    // Récupérer seulement les offres non expirées
    @Override
    @Transactional(readOnly = true)
    public List<OffreStageResponse> getOffresDisponibles() {
        return offreStageRepository.findByDateExpirationGreaterThanEqual(LocalDate.now())
                .stream()
                .map(offreStageMapper::toResponse)
                .toList();
    }

    // Récupérer les offres créées par un RH précis
    @Override
    @Transactional(readOnly = true)
    public List<OffreStageResponse> getByRhCreateurId(UUID rhCreateurId) {
        return offreStageRepository.findByRhCreateurId(rhCreateurId)
                .stream()
                .map(offreStageMapper::toResponse)
                .toList();
    }

    // Récupérer une offre par son ID
    @Override
    @Transactional(readOnly = true)
    public OffreStageResponse getById(UUID id) {
        OffreStage offreStage = offreStageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Offre de stage introuvable"));

        return offreStageMapper.toResponse(offreStage);
    }

    // Supprimer une offre
    @Override
    @Transactional
    public void delete(UUID id) {
        if (!offreStageRepository.existsById(id)) {
            throw new ResourceNotFoundException("Offre de stage introuvable");
        }

        offreStageRepository.deleteById(id);
    }
}

