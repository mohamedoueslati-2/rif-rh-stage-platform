package com.rif.rhstage.service.impl;

import com.rif.rhstage.dto.rh.PatchRhRequest;
import com.rif.rhstage.dto.rh.RhResponse;
import com.rif.rhstage.dto.rh.UpdateRhRequest;
import com.rif.rhstage.entity.RH;
import com.rif.rhstage.exception.BadRequestException;
import com.rif.rhstage.exception.ResourceNotFoundException;
import com.rif.rhstage.mapper.RhMapper;
import com.rif.rhstage.repository.PersonneRepository;
import com.rif.rhstage.repository.RhRepository;
import com.rif.rhstage.service.RhService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RhServiceImpl implements RhService {

    private final RhRepository rhRepository;
    private final PersonneRepository personneRepository;
    private final RhMapper rhMapper;

    // Récupérer le profil du RH connecté
    @Override
    @Transactional(readOnly = true)
    public RhResponse getProfil(UUID rhId) {
        RH rh = findRhById(rhId);

        return rhMapper.toResponse(rh);
    }

    // Modifier tout le profil RH
    @Override
    @Transactional
    public RhResponse updateProfil(UUID rhId, UpdateRhRequest request) {
        RH rh = findRhById(rhId);

        if (personneRepository.existsByEmailAndIdNot(request.email(), rhId)) {
            throw new BadRequestException("Email déjà utilisé");
        }

        rhMapper.updateEntity(rh, request);

        RH savedRh = rhRepository.save(rh);

        return rhMapper.toResponse(savedRh);
    }

    // Modifier partiellement le profil RH
    @Override
    @Transactional
    public RhResponse patchProfil(UUID rhId, PatchRhRequest request) {
        RH rh = findRhById(rhId);

        if (request.email() != null && personneRepository.existsByEmailAndIdNot(request.email(), rhId)) {
            throw new BadRequestException("Email déjà utilisé");
        }

        rhMapper.patchEntity(rh, request);

        RH savedRh = rhRepository.save(rh);

        return rhMapper.toResponse(savedRh);
    }

    private RH findRhById(UUID rhId) {
        return rhRepository.findById(rhId)
                .orElseThrow(() -> new ResourceNotFoundException("RH introuvable"));
    }
}