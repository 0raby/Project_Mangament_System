package com.example.simple_task_management_system.Service;

import com.example.simple_task_management_system.DTO.Create.UserCreateDTO;
import com.example.simple_task_management_system.DTO.ProjectInfoDTO;
import com.example.simple_task_management_system.DTO.Update.UpdateUserRoleDTO;
import com.example.simple_task_management_system.DTO.Update.UserUpdateDTO;
import com.example.simple_task_management_system.DTO.UserInfoDTO;
import com.example.simple_task_management_system.Entity.ApplicationUser;
import com.example.simple_task_management_system.Entity.PasswordResetToken;
import com.example.simple_task_management_system.Entity.Project;
import com.example.simple_task_management_system.Exception.CustomException;
import com.example.simple_task_management_system.Mapper.UserMapper;
import com.example.simple_task_management_system.Repository.PasswordResetTokenRepo;
import com.example.simple_task_management_system.Repository.UserRepo;
import jakarta.validation.constraints.Email;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class UserService {

    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;
    private final UserRepo userRepository;
    private final AuthenticationManager authenticationManager;
    private final JWTService jwtService;
    private final PasswordResetTokenRepo tokenRepository; //for forget password
    private final EmailService emailService;

    //sign up (Create)
    public String registerUser(UserCreateDTO userCreateDTO) {
        try {
            String email = userCreateDTO.getEmail().toLowerCase().trim();
            //check for email in DB
            if (userRepository.findByEmail(email).isPresent()) {
                throw new CustomException("Email already exists", HttpStatus.CONFLICT);
            }

            ApplicationUser applicationUser = new ApplicationUser();
            applicationUser = userMapper.fromCreateDTO(userCreateDTO);
            //hash the password
            applicationUser.setPassword(passwordEncoder.encode(userCreateDTO.getPassword()));

            applicationUser = userRepository.save(applicationUser);

            Authentication authentication = authenticationManager
                    .authenticate(new UsernamePasswordAuthenticationToken(email, userCreateDTO.getPassword()));
            if (authentication.isAuthenticated()) {
                var user = (ApplicationUser) authentication.getPrincipal();
                return jwtService.generateToken(user);
            } else {
                throw new CustomException("Error occurred while trying to register user", HttpStatus.CONFLICT);
            }
        }catch(Exception e){
            throw new CustomException("Error occurred while trying to register user", HttpStatus.CONFLICT);
        }

    }

    //login (Get)
    public String LoginUser(String email, String password) {
        Authentication authentication = authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(email, password));
        if (authentication.isAuthenticated()) {
            var user = (ApplicationUser) authentication.getPrincipal();
            return jwtService.generateToken(user);
        } else {
            throw new CustomException("Email or password is incorrect" , HttpStatus.NOT_FOUND);
        }
    }

    //get user for admin to change them to admin or remove
    public Page<UpdateUserRoleDTO> getPaginatedUsers(int page, int size) {


        Pageable pageable = PageRequest.of(page, size);
        Page<ApplicationUser> users = userRepository.findAll(pageable);

        return users.map(userMapper::toUpdateRoleDTO); //map each Project to ProjectInfoDTO
    }


    //update User
    public UserInfoDTO UpdateUser(UserUpdateDTO updateUser) {
        try {
            var UserWithID = userRepository.findByEmail(updateUser.getEmail());
            //make sure that the email in use is this user's email
            if (UserWithID.isPresent()) {
                if (!Objects.equals(UserWithID.get().getId(), updateUser.getId())) {
                    throw new CustomException("cannot change email ", HttpStatus.CONFLICT);
                }
            } else {
                throw new CustomException("cannot change email ", HttpStatus.CONFLICT);
            }
            ApplicationUser applicationUser = userMapper.fromUpdateDTO(updateUser);
            applicationUser.setPassword(passwordEncoder.encode(updateUser.getPassword()));
            applicationUser = userRepository.save(applicationUser);
            UserInfoDTO userInfoDTO = userMapper.toInfoDTO(applicationUser);
            return userInfoDTO;
        }
        catch(Exception e){
            throw new CustomException("There was an error in Updating your profile, please try again", HttpStatus.CONFLICT);
        }

    }


    //delete User
    public void deleteUser(UserUpdateDTO UserDTO) {
        try {
            ApplicationUser toDelete = userMapper.fromUpdateDTO(UserDTO);
            userRepository.delete(toDelete);
        }
        catch (Exception e){
            throw new CustomException("There was an error in deleting this profile, please try again", HttpStatus.CONFLICT);
        }
    }

    public UpdateUserRoleDTO updateUserRole(UpdateUserRoleDTO updateUserRoleDTO) {
        try {
            Integer id = updateUserRoleDTO.getId();
            ApplicationUser user = userRepository.findById(id)
                    .orElseThrow(() -> new CustomException("User not found", HttpStatus.NOT_FOUND));

            user.setRole(updateUserRoleDTO.getRole());
            return userMapper.toUpdateRoleDTO(userRepository.save(user));
        }
        catch(Exception e){
            throw new CustomException("There was an error in updating this user's role, please try again" , HttpStatus.CONFLICT);
        }
    }

    //get user by id
    public UserInfoDTO getUserById(Integer id) {
        try {
            ApplicationUser user = userRepository.findById(id).orElse(null);
            if (user == null) {
                return null;
            }
            return userMapper.toInfoDTO(user);

        }
        catch(Exception e){
            throw new CustomException("There was an error loading your profile, please refresh the page" , HttpStatus.CONFLICT);
        }
    }

    @Transactional
    public void sendResetCode(String email) {
        var user = userRepository.findByEmail(email);
        System.out.println(user);
        if (user.isEmpty()) {
            throw new CustomException("Email not registered", HttpStatus.NOT_FOUND);
        }

        // Generate 6-digit code
        String code = String.format("%06d", new Random().nextInt(999999));

        // Delete old token
        tokenRepository.deleteByEmail(email);

        PasswordResetToken token = new PasswordResetToken();
        token.setEmail(email);
        token.setToken(code);
        token.setExpiration(LocalDateTime.now().plusMinutes(10));
        tokenRepository.save(token);

        String body = """
Hello,

We received a request to reset your password.

Please use the following code to reset your password:

🔐 Reset Code: %s

If you did not request a password reset, please ignore this email or contact support.

Thanks,
Your Company Name
""".formatted(code);

        emailService.sendEmail(email, "Your Password Reset Code", body);
    }

    public Boolean verifyResetCode(String email, String code) {
        try {
            PasswordResetToken token = tokenRepository.findByEmailAndToken(email, code)
                    .orElseThrow(() -> new CustomException("Invalid or expired code", HttpStatus.BAD_REQUEST));

            if (token.getExpiration().isBefore(LocalDateTime.now())) {
                throw new CustomException("Reset code expired", HttpStatus.BAD_REQUEST);
            }

            token.setValid(true);
            tokenRepository.save(token);
            return true;
        }
        catch(Exception e){
            return false;
        }

    }

    public Boolean ResetPassword(String email, String code, String newPassword) {
        PasswordResetToken token = tokenRepository.findByEmailAndToken(email, code)
                .orElseThrow(() -> new CustomException("Invalid or expired code", HttpStatus.BAD_REQUEST));

        if (token.getExpiration().isBefore(LocalDateTime.now())) {
            throw new CustomException("Reset code expired", HttpStatus.BAD_REQUEST);
        }

        if(!token.getValid()){
            throw new CustomException("Reset code is invalid", HttpStatus.BAD_REQUEST);
        }
        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException("User not found", HttpStatus.NOT_FOUND));

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        return true;
    }


}
