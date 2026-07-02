package com.rif.rhstage.service.impl;

import com.rif.rhstage.dto.offre.OffreStageRequest;
import com.rif.rhstage.dto.offre.OffreStageResponse;
import com.rif.rhstage.dto.offre.PatchOffreStageRequest;
import com.rif.rhstage.dto.offre.UpdateOffreStageRequest;
import com.rif.rhstage.entity.OffreStage;
import com.rif.rhstage.entity.RH;
import com.rif.rhstage.exception.BadRequestException;
import com.rif.rhstage.exception.ResourceNotFoundException;
import com.rif.rhstage.mapper.OffreStageMapper;
import com.rif.rhstage.repository.DemandeRepository;
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
    private final DemandeRepository demandeRepository;
    private final OffreStageMapper offreStageMapper;

    @Override
    @Transactional
    public OffreStageResponse create(UUID rhId, OffreStageRequest request) {
        if (offreStageRepository.existsByReferenceOffre(request.referenceOffre())) {
            throw new BadRequestException("Référence offre déjà utilisée");
        }

        validateDates(request.dateDebut(), request.dateExpiration());

        RH rhCreateur = rhRepository.findById(rhId)
                .orElseThrow(() -> new ResourceNotFoundException("RH créateur introuvable"));

        OffreStage offreStage = offreStageMapper.toEntity(request, rhCreateur);
        OffreStage savedOffre = offreStageRepository.save(offreStage);

        return offreStageMapper.toResponse(savedOffre);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OffreStageResponse> getAll() {
        return offreStageRepository.findByDateExpirationGreaterThanEqual(LocalDate.now())
                .stream()
                .map(offreStageMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public OffreStageResponse getById(UUID id) {
        OffreStage offreStage = findOffreById(id);

        return offreStageMapper.toResponse(offreStage);
    }

    @Override
    @Transactional
    public OffreStageResponse update(UUID id, UUID rhId, UpdateOffreStageRequest request) {
        OffreStage offreStage = findOffreById(id);
        validateOwner(offreStage, rhId);

        if (offreStageRepository.existsByReferenceOffreAndIdNot(request.referenceOffre(), id)) {
            throw new BadRequestException("Référence offre déjà utilisée");
        }

        validateDates(request.dateDebut(), request.dateExpiration());

        offreStageMapper.updateEntity(offreStage, request);

        OffreStage savedOffre = offreStageRepository.save(offreStage);

        return offreStageMapper.toResponse(savedOffre);
    }

    @Override
    @Transactional
    public OffreStageResponse patch(UUID id, UUID rhId, PatchOffreStageRequest request) {
        OffreStage offreStage = findOffreById(id);
        validateOwner(offreStage, rhId);

        if (request.referenceOffre() != null
                && !request.referenceOffre().equals(offreStage.getReferenceOffre())
                && offreStageRepository.existsByReferenceOffreAndIdNot(request.referenceOffre(), id)) {
            throw new BadRequestException("Référence offre déjà utilisée");
        }

        LocalDate dateDebut = request.dateDebut() != null ? request.dateDebut() : offreStage.getDateDebut();
        LocalDate dateExpiration = request.dateExpiration() != null ? request.dateExpiration() : offreStage.getDateExpiration();

        validateDates(dateDebut, dateExpiration);

        offreStageMapper.patchEntity(offreStage, request);

        OffreStage savedOffre = offreStageRepository.save(offreStage);

        return offreStageMapper.toResponse(savedOffre);
    }

    @Override
    @Transactional
    public void delete(UUID id, UUID rhId) {
        OffreStage offreStage = findOffreById(id);
        validateOwner(offreStage, rhId);

        if (demandeRepository.existsByOffreStageId(id)) {
            throw new BadRequestException("Impossible de supprimer cette offre car elle possède déjà des demandes");
        }

        offreStageRepository.delete(offreStage);
    }

    private OffreStage findOffreById(UUID id) {
        return offreStageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Offre de stage introuvable"));
    }

    private void validateOwner(OffreStage offreStage, UUID rhId) {
        if (!offreStage.getRhCreateur().getId().equals(rhId)) {
            throw new BadRequestException("Vous n'êtes pas autorisé à modifier cette offre");
        }
    }

    private void validateDates(LocalDate dateDebut, LocalDate dateExpiration) {
        if (dateExpiration.isBefore(dateDebut)) {
            throw new BadRequestException("La date d'expiration doit être après la date de début");
        }
    }
}

