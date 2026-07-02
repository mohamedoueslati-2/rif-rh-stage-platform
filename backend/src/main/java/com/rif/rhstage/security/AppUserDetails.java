package com.rif.rhstage.security;

import com.rif.rhstage.entity.Candidat;
import com.rif.rhstage.entity.RH;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Getter
public class AppUserDetails implements UserDetails {

    private final UUID id;
    private final String email;
    private final String password;
    private final String role;

    public AppUserDetails(UUID id, String email, String password, String role) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.role = role;
    }

    public static AppUserDetails fromRh(RH rh) {
        return new AppUserDetails(
                rh.getId(),
                rh.getEmail(),
                rh.getMotDePasseHash(),
                "RH"
        );
    }

    public static AppUserDetails fromCandidat(Candidat candidat) {
        return new AppUserDetails(
                candidat.getId(),
                candidat.getEmail(),
                candidat.getMotDePasseHash(),
                "CANDIDAT"
        );
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role));
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}

