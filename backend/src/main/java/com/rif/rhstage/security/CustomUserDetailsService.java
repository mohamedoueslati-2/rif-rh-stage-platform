package com.rif.rhstage.security;

import com.rif.rhstage.repository.CandidatRepository;
import com.rif.rhstage.repository.RhRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final RhRepository rhRepository;
    private final CandidatRepository candidatRepository;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return rhRepository.findByEmail(email)
                .map(AppUserDetails::fromRh)
                .or(() -> candidatRepository.findByEmail(email).map(AppUserDetails::fromCandidat))
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur introuvable"));
    }
}

