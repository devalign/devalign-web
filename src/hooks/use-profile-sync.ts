'use client';

/* eslint-disable react-hooks/exhaustive-deps, react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import { useUserProfile } from '@/hooks/use-user-profile';
import { useCurrentUser } from '@/hooks/use-current-user';
import type { EducationItem, WorkExperienceItem, CertificationItem } from '@/lib/api/types';

export interface ProfileSyncData {
  fullName: string;
  roleTitle: string;
  seniority: string;
  educationList: EducationItem[];
  experiences: WorkExperienceItem[];
  certifications: CertificationItem[];
  techSkills: string[];
  conceptSkills: string[];
  softSkills: string[];
}

export function useProfileSync(): ProfileSyncData & { isLoading: boolean; error: unknown } {
  const { data: user, isLoading: isUserLoading, error: userError } = useCurrentUser();
  const { data: profile, isLoading: isProfileLoading, error: profileError } = useUserProfile();

  const [fullName, setFullName] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [seniority, setSeniority] = useState('mid');
  const [educationList, setEducationList] = useState<EducationItem[]>([]);
  const [experiences, setExperiences] = useState<WorkExperienceItem[]>([]);
  const [certifications, setCertifications] = useState<CertificationItem[]>([]);
  const [techSkills, setTechSkills] = useState<string[]>([]);
  const [conceptSkills, setConceptSkills] = useState<string[]>([]);
  const [softSkills, setSoftSkills] = useState<string[]>([]);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name ?? user?.full_name ?? user?.email?.split('@')[0] ?? 'Usuario');
      if (profile.current_job_role) setRoleTitle(profile.current_job_role);
      if (profile.seniority) setSeniority(profile.seniority);
      if (profile.education) setEducationList(profile.education);
      if (profile.work_experience) setExperiences(profile.work_experience);
      if (profile.certifications) setCertifications(profile.certifications);

      if (profile.detected_skills?.length) {
        const tech: string[] = [];
        const concept: string[] = [];
        const soft: string[] = [];
        profile.detected_skills.forEach((s) => {
          const t = s.skill_type?.toLowerCase() ?? '';
          if (t === 'soft' || t === 'soft_skill') soft.push(s.name);
          else if (t === 'concept' || t === 'methodology') concept.push(s.name);
          else tech.push(s.name);
        });
        setTechSkills(tech);
        setConceptSkills(concept);
        setSoftSkills(soft);
      }
    } else if (user) {
      setFullName(user.full_name ?? user.email?.split('@')[0] ?? 'Usuario');
      setRoleTitle('');
      setSeniority('mid');
      setExperiences([]);
      setEducationList([]);
      setCertifications([]);
      setTechSkills([]);
      setConceptSkills([]);
      setSoftSkills([]);
    }
  }, [profile, user]);

  return {
    fullName, roleTitle, seniority,
    educationList, experiences, certifications,
    techSkills, conceptSkills, softSkills,
    isLoading: isUserLoading || isProfileLoading,
    error: userError ?? profileError,
  };
}
