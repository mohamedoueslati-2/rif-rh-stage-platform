package com.rif.rhstage.service.impl;

import com.rif.rhstage.dto.rh.CreateRhRequest;
import com.rif.rhstage.dto.rh.RhResponse;
import com.rif.rhstage.entity.RH;
import com.rif.rhstage.exception.BadRequestException;
import com.rif.rhstage.exception.ResourceNotFoundException;
import com.rif.rhstage.mapper.RhMapper;
import com.rif.rhstage.repository.PersonneRepository;
import com.rif.rhstage.repository.RhRepository;
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
class RhServiceImplTest {

    @Mock
    private RhRepository rhRepository;

    @Mock
    private PersonneRepository personneRepository;

    @Mock
    private RhMapper rhMapper;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private RhServiceImpl rhService;

    @Test
    void create_shouldCreateRh_whenEmailNotUsed() {
        CreateRhRequest request = new CreateRhRequest(
                "RH",
                "Admin",
                "rh@test.com",
                "123456",
                "RH RIF",
                "contact@rif.com"
        );

        RH rh = new RH();
        RH savedRh = new RH();

        RhResponse response = new RhResponse(
                UUID.randomUUID(),
                "RH",
                "Admin",
                "rh@test.com",
                "RH RIF",
                "contact@rif.com",
                null
        );

        when(personneRepository.existsByEmail(request.email())).thenReturn(false);
        when(passwordEncoder.encode(request.motDePasse())).thenReturn("hashed-password");
        when(rhMapper.toEntity(request, "hashed-password")).thenReturn(rh);
        when(rhRepository.save(rh)).thenReturn(savedRh);
        when(rhMapper.toResponse(savedRh)).thenReturn(response);

        RhResponse result = rhService.create(request);

        assertNotNull(result);
        assertEquals("rh@test.com", result.email());

        verify(rhRepository).save(rh);
    }

    @Test
    void create_shouldThrowBadRequest_whenEmailAlreadyUsed() {
        CreateRhRequest request = new CreateRhRequest(
                "RH",
                "Admin",
                "rh@test.com",
                "123456",
                "RH RIF",
                "contact@rif.com"
        );

        when(personneRepository.existsByEmail(request.email())).thenReturn(true);

        assertThrows(BadRequestException.class, () -> rhService.create(request));

        verify(rhRepository, never()).save(any());
    }

    @Test
    void getAll_shouldReturnAllRh() {
        RH rh = new RH();

        RhResponse response = new RhResponse(
                UUID.randomUUID(),
                "RH",
                "Admin",
                "rh@test.com",
                "RH RIF",
                "contact@rif.com",
                null
        );

        when(rhRepository.findAll()).thenReturn(List.of(rh));
        when(rhMapper.toResponse(rh)).thenReturn(response);

        List<RhResponse> result = rhService.getAll();

        assertEquals(1, result.size());
        assertEquals("Admin", result.get(0).prenom());
    }

    @Test
    void getById_shouldReturnRh_whenExists() {
        UUID id = UUID.randomUUID();
        RH rh = new RH();

        RhResponse response = new RhResponse(
                id,
                "RH",
                "Admin",
                "rh@test.com",
                "RH RIF",
                "contact@rif.com",
                null
        );

        when(rhRepository.findById(id)).thenReturn(Optional.of(rh));
        when(rhMapper.toResponse(rh)).thenReturn(response);

        RhResponse result = rhService.getById(id);

        assertEquals(id, result.id());
    }

    @Test
    void getById_shouldThrowNotFound_whenRhDoesNotExist() {
        UUID id = UUID.randomUUID();

        when(rhRepository.findById(id)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> rhService.getById(id));
    }
}

