import { UserService } from '@spbogui-openmrs/shared/service';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState, useCallback } from 'react';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UseUser {
  count: number;
  increment: () => void;
}

export function useUser(): UseUser {
  const [count, setCount] = useState(0);
  const increment = useCallback(() => setCount((x) => x + 1), []);
  return { count, increment };
}

export function useFindOneUser(uuid: string, params = 'full', enabled = true) {
  const {
    data,
    refetch: findOneUser,
    isLoading,
  } = useQuery(
    ['user', uuid, params],
    async () => await UserService.findOne(uuid, params),
    { enabled }
  );

  const user = data ? data : undefined;
  const userForm = data ? data : undefined;
  return {
    user,
    userForm,
    findOneUser,
    isLoading,
  };
}


export function useFindUserSession(enabled = true) {
  const {
    data,
    refetch: session,
    isLoading,
  } = useQuery(
    ['user'],
    async () => await UserService.session(),
    { enabled }
  );

  const user = data ? data : undefined;
  const userForm = data ? data : undefined;
  return {
    user,
    userForm,
    session,
    isLoading,
  };
}
export function useFindAllUsers(view: string, params = 'full', enabled = true) {
  const {
    data,
    refetch: findAllUsers,
    isLoading,
  } = useQuery(
    ['user', view, params],
    async () => await UserService.findAll(view, params),
    { enabled }
  );

  const users = data ? data : [];
  return {
    users,
    findAllUsers,
    isLoading,
  };
}

export const useSaveOrUpdateUser = () => {
  const { mutate: saveOrUpdate, isLoading } = useMutation(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (data: any) => UserService.addOrUpdate(data, data.uuid)
  );
  return {
    saveOrUpdate,
    isLoading,
  };
};
