package com.rif.rhstage.service.impl;

import com.rif.rhstage.dto.candidat.CandidatResponse;
import com.rif.rhstage.dto.candidat.CreateCandidatRequest;
import com.rif.rhstage.entity.Candidat;
import com.rif.rhstage.exception.BadRequestException;
import com.rif.rhstage.exception.ResourceNotFoundException;
import com.rif.rhstage.mapper.CandidatMapper;
import com.rif.rhstage.repository.CandidatRepository;
import com.rif.rhstage.repository.PersonneRepository;
import com.rif.rhstage.service.CandidatService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CandidatServiceImpl implements CandidatService {

    private final CandidatRepository candidatRepository;
    private final PersonneRepository personneRepository;
    private final CandidatMapper candidatMapper;
    private final PasswordEncoder passwordEncoder;

    // Créer un candidat avec vérification email + hash mot de passe
    @Override
    @Transactional
    public CandidatResponse create(CreateCandidatRequest request) {
        if (personneRepository.existsByEmail(request.email())) {
            throw new BadRequestException("Email déjà utilisé");
        }

        String motDePasseHash = passwordEncoder.encode(request.motDePasse());
        Candidat candidat = candidatMapper.toEntity(request, motDePasseHash);

        Candidat savedCandidat = candidatRepository.save(candidat);

        return candidatMapper.toResponse(savedCandidat);
    }

    // Récupérer tous les candidats
    @Override
    @Transactional(readOnly = true)
    public List<CandidatResponse> getAll() {
        return candidatRepository.findAll()
                .stream()
                .map(candidatMapper::toResponse)
                .toList();
    }

    // Récupérer un candidat par son ID
    @Override
    @Transactional(readOnly = true)
    public CandidatResponse getById(UUID id) {
        Candidat candidat = candidatRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Candidat introuvable"));

        return candidatMapper.toResponse(candidat);
    }
}

