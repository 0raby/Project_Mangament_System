package com.example.simple_task_management_system.Mapper;

import com.example.simple_task_management_system.DTO.Create.UserCreateDTO;
import com.example.simple_task_management_system.DTO.Update.UpdateUserRoleDTO;
import com.example.simple_task_management_system.DTO.Update.UserUpdateDTO;
import com.example.simple_task_management_system.DTO.UserInfoDTO;
import com.example.simple_task_management_system.Entity.ApplicationUser;
import org.mapstruct.*;
import java.util.List;

@Mapper(componentModel = "spring", uses = {ProjectMapper.class})
public interface UserMapper {

    ApplicationUser fromCreateDTO(UserCreateDTO dto);
    ApplicationUser fromUpdateDTO(UserUpdateDTO dto);

    UserInfoDTO toInfoDTO(ApplicationUser user);
    UpdateUserRoleDTO toUpdateRoleDTO(ApplicationUser user);
    List<UserInfoDTO> toInfoDTOList(List<ApplicationUser> users);
}
