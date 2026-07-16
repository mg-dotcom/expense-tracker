package com.expensetracker.expense_tracker.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ApiResponse<T> {
    private int status;
    private String message;
    private T data;

    // ใช้ตอน error เช่น password ผิด, หา record ไม่เจอ
    // ระบุ status เองได้ (400, 404, 500) ไม่มี data ส่งกลับ (Void)
    public static ApiResponse<Void> error(int status, String message) {
        return new ApiResponse<>(status, message , null);
        //                    ↑
        //  Java รู้ว่า return type คือ ApiResponse<Void>
        //  เลยไม่ต้องเขียน <Void> ซ้ำตรงนี้
    }

    // ใช้ตอน success ที่มีข้อมูลส่งกลับ เช่น token, list, object
    // <T> ทำให้ data เป็น type อะไรก็ได้ตามที่ส่งเข้ามา
    public static <T> ApiResponse<T> ok(T data) {
        return new ApiResponse<>(200, "success", data);
    }

    // ใช้ตอน success แต่ไม่มีข้อมูลส่งกลับ มีแค่ข้อความ
    // เช่น "Expense deleted successfully"
    public static ApiResponse<Void> okMessage(String message) {
        return new ApiResponse<>(200, message, null);
    }

    // ใช้ตอนสร้างของใหม่สำเร็จ (POST ที่เพิ่ม record ลง DB)
    // status เป็น 201 ตามมาตรฐาน REST
    public static ApiResponse<Void> created(String message) {
        return new ApiResponse<>(201, message, null);
    }
}