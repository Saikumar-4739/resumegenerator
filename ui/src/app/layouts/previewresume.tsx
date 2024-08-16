import React, { useState, useEffect } from "react";
import { Button, Input, Form, message } from "antd";
import { useNavigate } from "react-router-dom";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  BankOutlined,
  IdcardOutlined,
  ProfileOutlined,
  CalendarOutlined,
  TrophyOutlined,
  FlagOutlined,
  ReadOutlined,
  GlobalOutlined,
  SolutionOutlined,
  ArrowRightOutlined,
  SaveOutlined,
  ArrowLeftOutlined,
  PercentageOutlined,
} from "@ant-design/icons";
import "../styles/previewresume.css";
import axios from "axios";

const { Item } = Form;

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
}

interface Experience {
  objective: string;
  companyName: string;
  role: string;
  fromYear: string;
  toYear: string;
  description: string;
}

interface Academic {
  institutionName: string;
  passingYear: string;
  qualification: string;
  university: string;
  percentage: string;
}

interface Skills {
  skillName: string;
  department: string;
}

interface PersonalDetails {
  fatherName: string;
  motherName: string;
  dateOfBirth: string;
  maritalStatus: string;
  languagesKnown: string;
}

interface Declaration {
  declaration: string;
  place: string;
}

interface UserDetails {
  name: string;
  email: string;
  mobile: string;
  address: Address;
  experience: Experience;
  academic: Academic;
  skills: Skills;
  personalDetails: PersonalDetails;
  declaration: Declaration;
}

export const PreviewResume: React.FC = () => {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userId = parseInt(localStorage.getItem("userId") || "0");
        if (!userId) {
          throw new Error("User ID is not available");
        }

        const response = await axios.post('http://localhost:3023/users/getUsersByUserIds', {
          userId: [userId],
        });

        if (response.data.status) {
          const user = response.data.data[0];
          setUserDetails(user);
        } else {
          throw new Error(response.data.internalMessage || "Failed to fetch user details");
        }
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
          message.error("Failed to fetch user details");
        } else {
          setError("An unknown error occurred");
          message.error("Failed to fetch user details");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  const handlePrevious = () => {
    navigate("/declaration");
  };

  const handleNextSection = () => {
    navigate("/download-page");
  };

  const handleEdit = () => {
    navigate("/user-form"); // Navigate to the UserForm component
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!userDetails) {
    return <div>No user details available</div>;
  }

  return (
    <div className="resume-preview">
      <h1>Preview Resume Details</h1>
      <Form layout="vertical" className="user-id-input" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <Item label="Full Name">
          <Input prefix={<UserOutlined />} value={userDetails.name} readOnly />
        </Item>
        <Item label="Email">
          <Input prefix={<MailOutlined />} type="email" value={userDetails.email} readOnly />
        </Item>
        <Item label="Phone">
          <Input prefix={<PhoneOutlined />} type="text" value={userDetails.mobile} readOnly />
        </Item>
        <Item label="Street">
          <Input prefix={<HomeOutlined />} value={userDetails.address.street} readOnly />
        </Item>
        <Item label="City">
          <Input prefix={<GlobalOutlined />} value={userDetails.address.city} readOnly />
        </Item>
        <Item label="State">
          <Input prefix={<GlobalOutlined />} value={userDetails.address.state} readOnly />
        </Item>
        <Item label="Country">
          <Input prefix={<FlagOutlined />} value={userDetails.address.country} readOnly />
        </Item>
        <Item label="Zipcode">
          <Input prefix={<GlobalOutlined />} value={userDetails.address.zipcode} readOnly />
        </Item>
        <Item label="Objective">
          <Input prefix={<ProfileOutlined />} value={userDetails.experience.objective} readOnly />
        </Item>
        <Item label="Company Name">
          <Input prefix={<BankOutlined />} value={userDetails.experience.companyName} readOnly />
        </Item>
        <Item label="Role">
          <Input prefix={<IdcardOutlined />} value={userDetails.experience.role} readOnly />
        </Item>
        <Item label="From Year">
          <Input prefix={<CalendarOutlined />} value={userDetails.experience.fromYear} readOnly />
        </Item>
        <Item label="To Year">
          <Input prefix={<CalendarOutlined />} value={userDetails.experience.toYear} readOnly />
        </Item>
        <Item label="Description">
          <Input prefix={<SolutionOutlined />} value={userDetails.experience.description} readOnly />
        </Item>
        <Item label="Institution Name">
          <Input prefix={<ReadOutlined />} value={userDetails.academic.institutionName} readOnly />
        </Item>
        <Item label="Passing Year">
          <Input prefix={<CalendarOutlined />} value={userDetails.academic.passingYear} readOnly />
        </Item>
        <Item label="Qualification">
          <Input prefix={<TrophyOutlined />} value={userDetails.academic.qualification} readOnly />
        </Item>
        <Item label="University">
          <Input prefix={<GlobalOutlined />} value={userDetails.academic.university} readOnly />
        </Item>
        <Item label="Percentage">
          <Input prefix={<PercentageOutlined />} value={userDetails.academic.percentage} readOnly />
        </Item>
        <Item label="Skill Name">
          <Input prefix={<IdcardOutlined />} value={userDetails.skills.skillName} readOnly />
        </Item>
        <Item label="Department">
          <Input prefix={<GlobalOutlined />} value={userDetails.skills.department} readOnly />
        </Item>
        <Item label="Father's Name">
          <Input prefix={<UserOutlined />} value={userDetails.personalDetails.fatherName} readOnly />
        </Item>
        <Item label="Mother's Name">
          <Input prefix={<UserOutlined />} value={userDetails.personalDetails.motherName} readOnly />
        </Item>
        <Item label="Date of Birth">
          <Input prefix={<CalendarOutlined />} value={userDetails.personalDetails.dateOfBirth} readOnly />
        </Item>
        <Item label="Marital Status">
          <Input prefix={<FlagOutlined />} value={userDetails.personalDetails.maritalStatus} readOnly />
        </Item>
        <Item label="Languages Known">
          <Input prefix={<GlobalOutlined />} value={userDetails.personalDetails.languagesKnown} readOnly />
        </Item>
        <Form.Item {...tailLayout}>
          <Button
            type="default"
            icon={<ArrowLeftOutlined />}
            onClick={handlePrevious}
          >
            Previous Section
          </Button>
          <Button
            type="default"
            icon={<ArrowRightOutlined />}
            onClick={handleNextSection}
          >
            Next Section
          </Button>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleEdit}
            style={{ margin: "0 8px" }}
          >
            Edit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
