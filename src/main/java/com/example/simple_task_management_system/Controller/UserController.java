package com.example.simple_task_management_system.Controller;

import com.example.simple_task_management_system.DTO.Create.UserCreateDTO;
import com.example.simple_task_management_system.DTO.LoginRequestDTO;
import com.example.simple_task_management_system.DTO.RequestPassResetDTO;
import com.example.simple_task_management_system.DTO.Update.UpdateUserRoleDTO;
import com.example.simple_task_management_system.DTO.Update.UserUpdateDTO;
import com.example.simple_task_management_system.DTO.UserInfoDTO;
import com.example.simple_task_management_system.Service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/signup")
    public String createUser(@Valid @RequestBody UserCreateDTO newUser) {
        return userService.registerUser(newUser);
    }
    @PostMapping("/login")
    public String login(@Valid @RequestBody LoginRequestDTO loginRequestDTO) {
        String email = loginRequestDTO.getEmail();
        String password = loginRequestDTO.getPassword();
//        UserInfoDTO loggedInUser = userService.LoginUser(email, password);
        String token = userService.LoginUser(email, password);
        return token;
    }
    @PutMapping
    public UserInfoDTO UpdateUser(@Valid @RequestBody UserUpdateDTO userUpdateDTO) {
        return userService.UpdateUser(userUpdateDTO);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/changeRole")
    public UpdateUserRoleDTO updateUserRole(@Valid @RequestBody UpdateUserRoleDTO updateUser) {
        return userService.updateUserRole(updateUser);
    }
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/changeRole")
    public Page<UpdateUserRoleDTO> updateUserRoles(@RequestParam(defaultValue = "0") int page,
                                                   @RequestParam(defaultValue = "10") int size) {
        return userService.getPaginatedUsers(page, size);
    }


    @DeleteMapping
    public void DeleteUser(@RequestBody UserUpdateDTO userUpdateDTO){
        userService.deleteUser(userUpdateDTO);
    }

    @GetMapping("/{id}")
    public UserInfoDTO GetUser(@PathVariable Integer id) {
        return userService.getUserById(id);
    }

    @PostMapping("/request-reset")
    public void requestReset(@RequestBody RequestPassResetDTO req){
//        System.out.println(email);
        userService.sendResetCode(req.getEmail());
    }

    @PutMapping("/verifyResetCode")
    public boolean verifyResetCode(@RequestBody RequestPassResetDTO req){
        return userService.verifyResetCode(req.getEmail(), req.getCode());
    }

    @PutMapping("/ResetPassword")
    public boolean resetPassword(@RequestBody RequestPassResetDTO req){
        return userService.ResetPassword(req.getEmail(), req.getCode(), req.getPassword());
    }
}
