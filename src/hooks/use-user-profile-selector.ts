import { useMemo } from 'react';
import { useCurrentUser } from './use-current-user';
import { useUserProfile } from './use-user-profile';
import { useUserCVs } from './use-user-cvs';
import { UserProfileData } from '@/types';

export function useUserProfileSelector() {
  const { data: user, isLoading: isUserLoading, error: userError } = useCurrentUser();
  const { data: profile, isLoading: isProfileLoading, error: profileError } = useUserProfile();
  const { data: cvData, isLoading: isCVLoading, error: cvError } = useUserCVs();

  const isLoading = isUserLoading || isProfileLoading || isCVLoading;
  const error = userError || profileError || cvError;

  const derivedProfile = useMemo<UserProfileData | null>(() => {
    if (!user && !profile) return null;

    const fullName = profile?.full_name || user?.full_name || user?.email?.split('@')[0] || 'Usuario';
    const roleTitle = profile?.current_job_role || '';
    const seniority = profile?.seniority || 'mid';
    const education = profile?.education || [];
    const experiences = profile?.work_experience || [];
    const certifications = profile?.certifications || [];

    // Preserve full skill objects including ict_score, market_importance, etc.
    const detected_skills = (profile?.detected_skills || []).map((s) => ({
      ...s,
      skill_type: s.skill_type || 'tech',
    }));

    // Gaps
    const skill_gaps = profile?.skill_gaps || [];

    // Derivar score y afinidad activa (por defecto)
    const allAffinities = profile?.all_affinities || [];
    const activeCluster = allAffinities.find((a) => a.is_primary) || allAffinities[0] || null;
    const activeScore = activeCluster ? Math.round(activeCluster.affinity_score * 100) : 50;

    const activeCvId = profile?.cv_id || cvData?.cvs?.[0]?.cv_id || null;
    const currentCv = cvData?.cvs?.find((cv) => cv.cv_id === activeCvId) || cvData?.cvs?.[0];
    const lastAnalysisDate = currentCv?.uploaded_at || null;

    return {
      user_id: user?.id || profile?.user_id || '',
      cv_id: activeCvId,
      full_name: fullName,
      current_job_role: roleTitle,
      professional_summary: profile?.professional_summary ?? null,
      seniority: seniority,
      years_experience: profile?.years_experience || 2,
      location: profile?.location || 'Lima, Peru',
      preferred_modality: profile?.preferred_modality || 'Híbrido / Presencial',
      availability: profile?.availability || 'Inmediata',
      alignment_score: activeScore,
      primary_specialty: activeCluster?.cluster_name || null,
      secondary_affinities: allAffinities.filter((a) => !a.is_primary),
      all_affinities: allAffinities,
      domain_affinities: profile?.domain_affinities || [],
      detected_skills,
      skill_gaps,
      education,
      work_experience: experiences,
      certifications,
      last_analysis_date: lastAnalysisDate,
      is_diagnosed: profile?.is_diagnosed ?? false,
    };
  }, [profile, user, cvData]);

  return {
    data: derivedProfile,
    isLoading,
    error,
  };
}
export type UseUserProfileSelectorReturn = ReturnType<typeof useUserProfileSelector>;
