package com.rif.rhstage.service.impl;

import com.rif.rhstage.dto.rh.CreateRhRequest;
import com.rif.rhstage.dto.rh.RhResponse;
import com.rif.rhstage.entity.RH;
import com.rif.rhstage.exception.BadRequestException;
import com.rif.rhstage.exception.ResourceNotFoundException;
import com.rif.rhstage.mapper.RhMapper;
import com.rif.rhstage.repository.PersonneRepository;
import com.rif.rhstage.repository.RhRepository;
import com.rif.rhstage.service.RhService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RhServiceImpl implements RhService {

    private final RhRepository rhRepository;
    private final PersonneRepository personneRepository;
    private final RhMapper rhMapper;
    private final PasswordEncoder passwordEncoder;

    // Créer un compte RH avec email unique + mot de passe hashé
    @Override
    @Transactional
    public RhResponse create(CreateRhRequest request) {
        if (personneRepository.existsByEmail(request.email())) {
            throw new BadRequestException("Email déjà utilisé");
        }

        String motDePasseHash = passwordEncoder.encode(request.motDePasse());
        RH rh = rhMapper.toEntity(request, motDePasseHash);

        RH savedRh = rhRepository.save(rh);

        return rhMapper.toResponse(savedRh);
    }

    // Récupérer tous les RH
    @Override
    @Transactional(readOnly = true)
    public List<RhResponse> getAll() {
        return rhRepository.findAll()
                .stream()
                .map(rhMapper::toResponse)
                .toList();
    }

    // Récupérer un RH par son ID
    @Override
    @Transactional(readOnly = true)
    public RhResponse getById(UUID id) {
        RH rh = rhRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("RH introuvable"));

        return rhMapper.toResponse(rh);
    }
}

