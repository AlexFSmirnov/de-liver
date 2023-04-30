import { OrganQuality } from '../../common';

enum PersonWeight {
    Underweight = 'Underweight',
    Normal = 'Normal',
    Overweight = 'Overweight',
}

export enum PersonType {
    Normal = 'Normal',
    Sports = 'Sports',
    Rich = 'Rich',

    Cyborg = 'Cyborg',
    Reptiloid = 'Reptiloid',
}

export interface PersonOption {
    age: number;
    weight: PersonWeight;
    clothes: string;
    items: string;
    comment: string;
    type: PersonType;
    captureProbability: number;
    organQuality: OrganQuality;
}

const selectRandomOption = (options: string[]) => {
    const randomIndex = Math.floor(Math.random() * options.length);
    return options[randomIndex];
};

const getOrganQualityByPersonOption = (
    personOption: Omit<PersonOption, 'captureProbability' | 'organQuality'>
) => {
    const { age, weight, type } = personOption;

    const ageQuality = 1 - (age - 18) / (90 - 18) - 0.2;
    const weightQuality = weight === PersonWeight.Normal ? 0.8 : 0.3;

    let typeQuality = 0.3;
    if (type === PersonType.Rich) {
        typeQuality = 0.8;
    } else if (type === PersonType.Sports) {
        typeQuality = 1;
    }

    const quality = (ageQuality + weightQuality + typeQuality) / 3;

    if (quality < 0.33) {
        return OrganQuality.Bad;
    }

    if (quality < 0.66) {
        return OrganQuality.Medium;
    }

    return OrganQuality.Good;
};

const getAgeCaptureProbability = (age: number, captureToolLevel: number) => {
    const ageProbability = 0.5 + ((age - 18) / (90 - 18)) * 0.5;
    const captureProbability = ageProbability + 0.1 * captureToolLevel;
    return Math.min(1, captureProbability);
};

const getWeightCaptureProbability = (weight: PersonWeight, captureToolLevel: number) => {
    const weightProbability = weight === PersonWeight.Normal ? 0.5 : 0.75;
    const captureProbability = weightProbability + 0.1 * captureToolLevel;
    return Math.min(1, captureProbability);
};

const getPersonTypeCaptureProbability = (personType: PersonType, captureToolLevel: number) => {
    const typeProbability = personType === PersonType.Normal ? 0.6 : 0.3;
    const captureProbability = typeProbability + 0.1 * captureToolLevel;
    return Math.min(1, captureProbability);
};

const getPersonOptionCaptureProbability = (
    personOption: Omit<PersonOption, 'captureProbability' | 'organQuality'>,
    captureToolLevel: number
) => {
    if (personOption.type === PersonType.Cyborg || personOption.type === PersonType.Reptiloid) {
        return 1;
    }

    const ageProbability = getAgeCaptureProbability(personOption.age, captureToolLevel);
    const weightProbability = getWeightCaptureProbability(personOption.weight, captureToolLevel);
    const typeProbability = getPersonTypeCaptureProbability(personOption.type, captureToolLevel);

    return (ageProbability + weightProbability + typeProbability) / 3;
};

const getRandomAge = (surveillanceToolLevel: number) => {
    const minAge = 18;
    const maxAge = 90;

    // Adjust the age distribution based on the surveillanceToolLevel
    const ageDistributionFactor = 1 - (0.25 * surveillanceToolLevel) / 5;

    // Generate a random number between 0 and 1
    const randomNumber = Math.random();

    // Calculate the victim's age using the age distribution factor
    const age = Math.floor(
        minAge +
            (maxAge - minAge) ** ageDistributionFactor * randomNumber ** (1 / ageDistributionFactor)
    );

    return age;
};

const getRandomWeight = (surveillanceToolLevel: number) => {
    const normalProbability = 0.15 * surveillanceToolLevel;

    if (Math.random() < normalProbability) {
        return PersonWeight.Normal;
    }

    if (Math.random() < 0.5) {
        return PersonWeight.Underweight;
    }

    return PersonWeight.Overweight;
};

const getRandomPersonType = (surveillanceToolLevel: number) => {
    const sportsProbability = 0.12 * surveillanceToolLevel;

    if (Math.random() < sportsProbability) {
        return PersonType.Sports;
    }

    const richProbability = 0.15 * surveillanceToolLevel;

    if (Math.random() < richProbability) {
        return PersonType.Rich;
    }

    return PersonType.Normal;
};

export const getRandomPersonOption = (
    surveillanceToolLevel: number,
    captureToolLevel: number
): PersonOption => {
    const age = getRandomAge(surveillanceToolLevel);
    const weight = getRandomWeight(surveillanceToolLevel);

    const personType = getRandomPersonType(surveillanceToolLevel);

    let clothes = '';
    let items = '';
    let comment = '';
    if (personType === PersonType.Sports) {
        clothes = selectRandomOption([
            'Tracksuit',
            'Sweatpants',
            'Athletic Shorts',
            'Compression Shirt',
            'Running Shoes',
        ]);
        items = selectRandomOption([
            'Water Bottle',
            'Fitness Tracker',
            'Gym Bag',
            'Sweat Towel',
            'Resistance Bands',
        ]);
        comment = selectRandomOption([
            'Athletic build, confident stride, radiates determination and energy.',
            'Toned muscles, swift movements, exudes discipline and focus.',
            'Agile and nimble, effortlessly glides through physical challenges.',
            'Strong posture, graceful motion, a picture of endurance and strength.',
            'Energetic demeanor, displays unwavering dedication to physical fitness.',
        ]);
    } else if (personType === PersonType.Rich) {
        clothes = selectRandomOption([
            'Designer Suit',
            'Luxury Dress',
            'Tailored Jacket',
            'Silk Blouse',
            'High-End Shoes',
        ]);
        items = selectRandomOption([
            'Expensive Watch',
            'Designer Handbag',
            'Luxury Car Key',
            'Gold Cufflinks',
            'Diamond Jewelry',
        ]);
        comment = selectRandomOption([
            'Poised and confident, exuding wealth and sophistication.',
            'Immaculate attire, commanding presence, an air of affluence.',
            'Elegant movements, refined taste, effortlessly stylish.',
            'Impeccable grooming, charismatic charm, a picture of success.',
            'Prestigious aura, distinctive accessories, unmatched opulence.',
        ]);
    } else if (personType === PersonType.Normal) {
        clothes = selectRandomOption(['T-Shirt', 'Jeans', 'Sweater', 'Plaid Shirt', 'Nice Shoes']);
        items = selectRandomOption(['Smartphone', 'Backpack', 'Wallet', 'Keys', 'Sunglasses']);
        comment = selectRandomOption([
            'Relaxed demeanor, approachable and friendly.',
            'Average build, moves with ease and comfort.',
            'Casual attire, blending in effortlessly.',
            'Unassuming presence, displays genuine warmth.',
            'Everyday style, exudes contentment and simplicity.',
        ]);
    }

    let finalPersonType = personType;
    if (Math.random() < 0.07) {
        if (Math.random() < 0.5) {
            finalPersonType = PersonType.Cyborg;
            comment = selectRandomOption([
                'Strangely perfect posture, movements almost mechanical in precision.',
                'Unnervingly steady gaze, unwavering and calculated.',
                'Subtle metallic sheen beneath the skin, barely noticeable.',
                'Unusual strength, masked by an otherwise unassuming appearance.',
                'Emotions seem muted, expressions just a little too controlled.',
            ]);
        } else {
            finalPersonType = PersonType.Reptiloid;
            comment = selectRandomOption([
                'Eyes slightly too narrow, with an unnerving, reptilian quality.',
                'Skin texture seems unusual, faintly reminiscent of scales.',
                'Movements oddly fluid, slithering rather than walking.',
                'An unsettling hiss to their speech, almost snake-like.',
                'Cold demeanor, with an air of predatory calculation.',
            ]);
        }
    }

    const option = {
        age,
        weight,
        clothes,
        items,
        comment,
        type: finalPersonType,
    };

    const captureProbability = getPersonOptionCaptureProbability(option, captureToolLevel);
    const organQuality = getOrganQualityByPersonOption(option);

    return {
        ...option,
        captureProbability,
        organQuality,
    };
};

export const getRangeFromAge = (age: number) => {
    if (age < 25) {
        return '18-25';
    }
    if (age < 35) {
        return '25-35';
    }
    if (age < 50) {
        return '35-50';
    }
    if (age < 70) {
        return '50-70';
    }
    return '70+';
};
