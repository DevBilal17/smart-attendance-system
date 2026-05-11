import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    toast.success("Account created successfully 🎉");
    console.log(data);
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="p-6 w-[350px] space-y-4">
        <h2 className="text-xl font-bold">Register</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          <div>
            <Label>Name</Label>
            <Input
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label>Email</Label>
            <Input
              type="email"
              {...register("email", { required: "Email is required" })}
            />
          </div>

          <div>
            <Label>Password</Label>
            <Input
              type="password"
              {...register("password", { required: "Password is required" })}
            />
          </div>

          <div>
            <Label>Confirm Password</Label>
            <Input
              type="password"
              {...register("confirmPassword", { required: "Confirm password" })}
            />
          </div>

          <Button className="w-full">Register</Button>
        </form>
      </Card>
    </div>
  );
};

export default RegisterForm;