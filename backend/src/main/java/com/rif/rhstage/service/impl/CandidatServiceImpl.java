package com.rif.rhstage.service.impl;

import com.rif.rhstage.dto.candidat.*;
import com.rif.rhstage.entity.Candidat;
import com.rif.rhstage.exception.BadRequestException;
import com.rif.rhstage.exception.ResourceNotFoundException;
import com.rif.rhstage.mapper.CandidatMapper;
import com.rif.rhstage.repository.CandidatRepository;
import com.rif.rhstage.repository.DemandeRepository;
import com.rif.rhstage.repository.PersonneRepository;
import com.rif.rhstage.service.CandidatService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CandidatServiceImpl implements CandidatService {

    private final CandidatRepository candidatRepository;
    private final PersonneRepository personneRepository;
    private final DemandeRepository demandeRepository;
    private final CandidatMapper candidatMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public CandidatResponse register(CreateCandidatRequest request) {
        if (personneRepository.existsByEmail(request.email())) {
            throw new BadRequestException("Email déjà utilisé");
        }

        String motDePasseHash = passwordEncoder.encode(request.motDePasse());
        Candidat candidat = candidatMapper.toEntity(request, motDePasseHash);

        Candidat savedCandidat = candidatRepository.save(candidat);

        return candidatMapper.toResponse(savedCandidat);
    }

    @Override
    @Transactional(readOnly = true)
    public CandidatResponse getProfil(UUID candidatId) {
        Candidat candidat = findCandidatById(candidatId);

        return candidatMapper.toResponse(candidat);
    }

    @Override
    @Transactional
    public CandidatResponse updateProfil(UUID candidatId, UpdateCandidatRequest request) {
        Candidat candidat = findCandidatById(candidatId);

        if (personneRepository.existsByEmailAndIdNot(request.email(), candidatId)) {
            throw new BadRequestException("Email déjà utilisé");
        }

        candidatMapper.updateEntity(candidat, request);

        Candidat savedCandidat = candidatRepository.save(candidat);

        return candidatMapper.toResponse(savedCandidat);
    }

    @Override
    @Transactional
    public CandidatResponse patchProfil(UUID candidatId, PatchCandidatRequest request) {
        Candidat candidat = findCandidatById(candidatId);

        if (request.email() != null && personneRepository.existsByEmailAndIdNot(request.email(), candidatId)) {
            throw new BadRequestException("Email déjà utilisé");
        }

        candidatMapper.patchEntity(candidat, request);

        Candidat savedCandidat = candidatRepository.save(candidat);

        return candidatMapper.toResponse(savedCandidat);
    }

    @Override
    @Transactional
    public void changePassword(UUID candidatId, ChangeCandidatPasswordRequest request) {
        Candidat candidat = findCandidatById(candidatId);

        if (!passwordEncoder.matches(request.oldPassword(), candidat.getMotDePasseHash())) {
            throw new BadRequestException("Ancien mot de passe incorrect");
        }

        candidat.setMotDePasseHash(passwordEncoder.encode(request.newPassword()));

        candidatRepository.save(candidat);
    }

    @Override
    @Transactional
    public void deleteProfil(UUID candidatId) {
        Candidat candidat = findCandidatById(candidatId);

        if (demandeRepository.existsByCandidatId(candidatId)) {
            throw new BadRequestException("Impossible de supprimer ce compte car il possède déjà des demandes");
        }

        candidatRepository.delete(candidat);
    }

    private Candidat findCandidatById(UUID candidatId) {
        return candidatRepository.findById(candidatId)
                .orElseThrow(() -> new ResourceNotFoundException("Candidat introuvable"));
    }
}

