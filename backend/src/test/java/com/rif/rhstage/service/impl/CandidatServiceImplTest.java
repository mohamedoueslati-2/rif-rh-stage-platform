package com.rif.rhstage.service.impl;

import com.rif.rhstage.dto.candidat.CandidatResponse;
import com.rif.rhstage.dto.candidat.CreateCandidatRequest;
import com.rif.rhstage.entity.Candidat;
import com.rif.rhstage.exception.BadRequestException;
import com.rif.rhstage.exception.ResourceNotFoundException;
import com.rif.rhstage.mapper.CandidatMapper;
import com.rif.rhstage.repository.CandidatRepository;
import com.rif.rhstage.repository.PersonneRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CandidatServiceImplTest {

    @Mock
    private CandidatRepository candidatRepository;

    @Mock
    private PersonneRepository personneRepository;

    @Mock
    private CandidatMapper candidatMapper;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private CandidatServiceImpl candidatService;

    @Test
    void create_shouldCreateCandidat_whenEmailNotUsed() {
        CreateCandidatRequest request = new CreateCandidatRequest(
                "Oueslati",
                "Mohamed",
                "mohamed@test.com",
                "123456",
                "12345678",
                "Software Engineering",
                "4eme annee"
        );

        Candidat candidat = new Candidat();
        Candidat savedCandidat = new Candidat();

        CandidatResponse response = new CandidatResponse(
                UUID.randomUUID(),
                "Oueslati",
                "Mohamed",
                "mohamed@test.com",
                "12345678",
                "Software Engineering",
                "4eme annee",
                null
        );

        when(personneRepository.existsByEmail(request.email())).thenReturn(false);
        when(passwordEncoder.encode(request.motDePasse())).thenReturn("hashed-password");
        when(candidatMapper.toEntity(request, "hashed-password")).thenReturn(candidat);
        when(candidatRepository.save(candidat)).thenReturn(savedCandidat);
        when(candidatMapper.toResponse(savedCandidat)).thenReturn(response);

        CandidatResponse result = candidatService.create(request);

        assertNotNull(result);
        assertEquals("mohamed@test.com", result.email());

        verify(candidatRepository).save(candidat);
    }

    @Test
    void create_shouldThrowBadRequest_whenEmailAlreadyUsed() {
        CreateCandidatRequest request = new CreateCandidatRequest(
                "Oueslati",
                "Mohamed",
                "mohamed@test.com",
                "123456",
                "12345678",
                "Software Engineering",
                "4eme annee"
        );

        when(personneRepository.existsByEmail(request.email())).thenReturn(true);

        assertThrows(BadRequestException.class, () -> candidatService.create(request));

        verify(candidatRepository, never()).save(any());
    }

    @Test
    void getAll_shouldReturnAllCandidats() {
        Candidat candidat = new Candidat();

        CandidatResponse response = new CandidatResponse(
                UUID.randomUUID(),
                "Oueslati",
                "Mohamed",
                "mohamed@test.com",
                "12345678",
                "Software Engineering",
                "4eme annee",
                null
        );

        when(candidatRepository.findAll()).thenReturn(List.of(candidat));
        when(candidatMapper.toResponse(candidat)).thenReturn(response);

        List<CandidatResponse> result = candidatService.getAll();

        assertEquals(1, result.size());
        assertEquals("Mohamed", result.get(0).prenom());
    }

    @Test
    void getById_shouldReturnCandidat_whenExists() {
        UUID id = UUID.randomUUID();
        Candidat candidat = new Candidat();

        CandidatResponse response = new CandidatResponse(
                id,
                "Oueslati",
                "Mohamed",
                "mohamed@test.com",
                "12345678",
                "Software Engineering",
                "4eme annee",
                null
        );

        when(candidatRepository.findById(id)).thenReturn(Optional.of(candidat));
        when(candidatMapper.toResponse(candidat)).thenReturn(response);

        CandidatResponse result = candidatService.getById(id);

        assertEquals(id, result.id());
    }

    @Test
    void getById_shouldThrowNotFound_whenCandidatDoesNotExist() {
        UUID id = UUID.randomUUID();

        when(candidatRepository.findById(id)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> candidatService.getById(id));
    }
}

