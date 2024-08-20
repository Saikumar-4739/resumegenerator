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
  GlobalOutlined,
  SolutionOutlined,
  PercentageOutlined,
  LeftOutlined,
  RightOutlined,
  ReadOutlined,
  SaveOutlined,
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
  experience: Experience[];
  academic: Academic[];
  skills: Skills[];
  personalDetails: PersonalDetails;
  declaration: Declaration;
}

export const PreviewResume: React.FC = () => {
  const [userDetailsList, setUserDetailsList] = useState<UserDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentUserIndex, setCurrentUserIndex] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          throw new Error("User ID is not available");
        }

        const response = await axios.post(`http://localhost:3023/users/getUsersByUserIds/${userId}`);

        if (response.data.status) {
          setUserDetailsList(response.data.data);
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

  const handlePreviousUser = () => {
    navigate("/personal-details");
  };

  const handleNextUser = () => {
    navigate("/download-page");
  };

  const handleEdit = () => {
    navigate("/user-form");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (userDetailsList.length === 0) {
    return <div>No user details available</div>;
  }

  const userDetails = userDetailsList[currentUserIndex];

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
        
        {userDetails.experience.map((exp, index) => (
          <React.Fragment key={index}>
            <h3>Experience {index + 1}</h3>
            <Item label="Objective">
              <Input prefix={<ProfileOutlined />} value={exp.objective} readOnly />
            </Item>
            <Item label="Company Name">
              <Input prefix={<BankOutlined />} value={exp.companyName} readOnly />
            </Item>
            <Item label="Role">
              <Input prefix={<IdcardOutlined />} value={exp.role} readOnly />
            </Item>
            <Item label="From Year">
              <Input prefix={<CalendarOutlined />} value={exp.fromYear} readOnly />
            </Item>
            <Item label="To Year">
              <Input prefix={<CalendarOutlined />} value={exp.toYear} readOnly />
            </Item>
            <Item label="Description">
              <Input prefix={<SolutionOutlined />} value={exp.description} readOnly />
            </Item>
          </React.Fragment>
        ))}

        {userDetails.academic.map((acad, index) => (
          <React.Fragment key={index}>
            <h3>Academic {index + 1}</h3>
            <Item label="Institution Name">
              <Input prefix={<ReadOutlined />} value={acad.institutionName} readOnly />
            </Item>
            <Item label="Passing Year">
              <Input prefix={<CalendarOutlined />} value={acad.passingYear} readOnly />
            </Item>
            <Item label="Qualification">
              <Input prefix={<TrophyOutlined />} value={acad.qualification} readOnly />
            </Item>
            <Item label="University">
              <Input prefix={<GlobalOutlined />} value={acad.university} readOnly />
            </Item>
            <Item label="Percentage">
              <Input prefix={<PercentageOutlined />} value={acad.percentage} readOnly />
            </Item>
          </React.Fragment>
        ))}

        {userDetails.skills.map((skill, index) => (
          <React.Fragment key={index}>
            <h3>Skill {index + 1}</h3>
            <Item label="Skill Name">
              <Input prefix={<IdcardOutlined />} value={skill.skillName} readOnly />
            </Item>
            <Item label="Department">
              <Input prefix={<GlobalOutlined />} value={skill.department} readOnly />
            </Item>
          </React.Fragment>
        ))}

        <Item label="Father's Name">
          <Input prefix={<UserOutlined />} value={userDetails.personalDetails.fatherName} readOnly />
        </Item>
        <Item label="Mother's Name">
          <Input prefix={<UserOutlined />} value={userDetails.personalDetails.motherName} readOnly />
        </Item>
        <Item label="Date of Birth">
          <Input value={userDetails.personalDetails.dateOfBirth} readOnly />
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
            icon={<LeftOutlined />}
            onClick={handlePreviousUser}
            disabled={currentUserIndex === 0}
          >
            Previous
          </Button>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleEdit}
            style={{ margin: "0 8px" }}
          >
            Edit
          </Button>
          <Button
            type="default"
            icon={<RightOutlined />}
            onClick={handleNextUser}
            disabled={currentUserIndex === userDetailsList.length - 1}
          >
            Next
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
